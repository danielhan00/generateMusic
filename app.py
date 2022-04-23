from urllib.parse import MAX_CACHE_SIZE
from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from api.TestApi import TestApi
#from livePerformanceApi import livePerformanceApi
from midiparser_backend.src.secondOrderMarkovChain import Any, secondOrderMarkovChain
import csv
import json

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)  # comment this on deployment
api = Api(app)
genre_map = {}
genre_names = set()

@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


api.add_resource(TestApi, '/flask/hello')

#Methods for training and reading markov chains

def generalize_genres(genre: str):
    if (genre == 'Acoustic Blues' or genre == 'Blues & Folk' or genre == 'Blues-Rock' or genre == 'Soul' or genre == 'R&B & Soul'):
        return 'R&B & Soul'
    elif (genre == 'Classic Rock' or genre == 'College Rock' or genre == 'Glam Rock' or genre == 'Indie Rock' 
    or genre == 'Rock' or genre == 'Rock & Roll' or genre == 'Southern Rock' or genre == 'Folk-Rock'
    or genre == 'Hard Rock' or genre == 'Ska' or genre == 'Classic Rock' or genre == 'Country'):
        return 'Rock'
    elif (genre == 'Pop' or genre == 'Easy Listening' or genre == 'Pop & Rock' or genre == 'Singer & Songwriter'):
        return 'Pop'
    elif (genre == 'Christian Rock' or genre == 'Inspirational' or genre == 'Praise & Worship'):
        return "Religious Music"
    elif (genre == 'Dance' or genre == 'Dance & Electronic' or genre == 'Disco' or genre == 'House' or genre == 'Electronic'):
        return "Dance & EDM"
    elif (genre == 'Jazz' or genre == 'Vocal Jazz'):
        return "Jazz"
    elif (genre == 'Alternative Folk' or genre == 'Adult Alternative' or genre == 'Alternative' or genre == 'Classic Rock'
     or genre == 'Prog-Rock' or genre == 'Prog-Rock & Art Rock'):
        return "Alternative"
    elif (genre == 'Hip-Hop' or genre == 'Hip-Hop & Rap'):
        return "Hip-Hop"
    elif (genre == 'Grunge' or genre == 'Punk' or genre == 'Metal'):
        return 'Punk & Metal'
    elif (genre == '' or genre == 'Misc' or genre == 'Modern Composition'):
        return 'Random'
    else:
        return genre

def train_markov_chains():
    # system for parsing csvs and creating markov chain
    print('training markov chains')

    # to read the csv file
    file = open('midiparser_backend/dataWithRomanAndMode.csv')
    csvreader = csv.reader(file)
    header = next(csvreader)
    for row in csvreader:
        genre = generalize_genres(str(row[4]).replace('/', ' & '))
        # add genre to set for retrieval from front end
        genre_names.add(genre)

        tonality = str(row[9])
        currMarkov = ""
        # merge genre and tonality so markov chains are separate for major and minor
        genre_tonality = genre + '_' + tonality

        # check if there is an existing markov chain, make one if not
        if genre_map.keys().__contains__(genre_tonality):
            currMarkov = genre_map.get(genre_tonality)
        else:
            currMarkov = secondOrderMarkovChain(genre_tonality, True)

        chords = row[8].split(',')
        prev2Chord = None
        prevChord = None
        for chord in chords:
            currMarkov.add_one_event(prev2Chord, prevChord, chord)
            prevChord = '' + chord
            prev2Chord = '' + prevChord
        #print(genre)
        #print(currMarkov)
        #currMarkov.refresh_mc()
        genre_map[genre_tonality] = currMarkov

    for key in genre_names:
        #genre_map.get(key).write_markov_chain_to_file()
        print(key)
    # create files for each markov chain
train_markov_chains()

def read_markov_chain(genre: str):
    markovChain = secondOrderMarkovChain(genre, True)
    markovChain.read_markov_chain_from_file(genre)
    #print(len(markovChain.get_all_status()))
    #markovChain.spit_out_all_possibility()
    print(markovChain.run('im', 5))

#read_markov_chain('Dance')
print('trying to run from global variable')
#genre_map.get('Dance').run('im', 3)
genre_map.get('Rock_Minor').run(5)

#LIVE PERFORMANCE API
class livePerformanceApi(Resource):
  def get(self):
    print('in api get')
    genreOptions = list(genre_names)
    genresString =''
    for i in range(len(genreOptions)):
        genresString += genreOptions[i]
        if (i < len(genreOptions) - 1):
            genresString += ','
    print(genresString)
    return {
      'resultStatus': 'SUCCESS',
      'genreOptions': genresString
      }

  def post(self):
    print(self)
    parser = reqparse.RequestParser()
    parser.add_argument('genre', type=str)
    parser.add_argument('key', type=str)
    parser.add_argument('tonality', type=str)
    parser.add_argument('numChords', type=int)

    args = parser.parse_args()

    print(args)
    # note, the post req from frontend needs to match the strings here
    # manual starting chord waiting for revised run method

    try:
        print(genre_map.get(args.genre + '_' + args.tonality))
        chords = genre_map.get(args.genre + '_' + args.tonality).run(args.numChords)
        return {
            'resultStatus': 'SUCCESS',
            'chords': chords,
        }
    except:
        return {
            'resultStatus': 'FAILURE',
            'chords': 'Request Failed, Try Again'
        }

api.add_resource(livePerformanceApi, '/flask/getchords')
