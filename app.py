from urllib.parse import MAX_CACHE_SIZE
from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from api.TestApi import TestApi
#from livePerformanceApi import livePerformanceApi
from midiparser_backend.src.secondOrderMarkovChain import Any, secondOrderMarkovChain
from midiparser_backend.src.markovUtility import findAllChords, getNotesFromChordName
import csv

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

# generalizes genres to make larger markov chains for groups of genres
def generalize_genres(genre: str):
    if (genre == 'Acoustic Blues' or genre == 'Blues & Folk' or genre == 'Blues-Rock' or genre == 'Soul' or genre == 'R&B & Soul'):
        return 'R&B & Soul'
    elif (genre == 'Classic Rock' or genre == 'College Rock' or genre == 'Glam Rock' or genre == 'Indie Rock' 
    or genre == 'Rock' or genre == 'Rock & Roll' or genre == 'Southern Rock' or genre == 'Folk-Rock'
    or genre == 'Hard Rock' or genre == 'Ska' or genre == 'Classic Rock' or genre == 'Country'):
        return 'Rock'
    elif (genre == 'Pop' or genre == 'Easy Listening' or genre == 'Pop & Rock' or genre == 'Singer & Songwriter' or genre == 'My Super Sweet 16' or genre == 'Latin'):
        return 'Pop'
    elif (genre == 'Christian Rock' or genre == 'Inspirational' or genre == 'Praise & Worship'):
        return "Religious"
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

# method for training markov chains at the start of application, stores genre names in genre_names and all markov chains in genre_map
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

        # get tonality from csv
        tonality = str(row[9])
        currMarkov = ""
        # merge genre and tonality so markov chains are separate for major and minor
        genre_tonality = genre + '_' + tonality
        # check if there is an existing markov chain, make one if not
        if genre_map.keys().__contains__(genre_tonality):
            currMarkov = genre_map.get(genre_tonality)
        else:
            currMarkov = secondOrderMarkovChain(genre_tonality, True)

        # train markov chain with chords from current song
        chords = row[8].split(',')
        prev2Chord = None
        prevChord = None
        for chord in chords:
            currMarkov.add_one_event(prev2Chord, prevChord, chord)
            prevChord = '' + chord
            prev2Chord = '' + prevChord
        genre_map[genre_tonality] = currMarkov

    for key in genre_map:
        genre_map[key].refresh_mc()
        #genre_map[key].write_markov_chain_to_file()
        print(key)
train_markov_chains()
#print(findAllChords('A', genre_map.get('Rock_Minor').run(5)))

# NOT USED: reading markov chain takes too long
def read_markov_chain(genre: str):
    markovChain = secondOrderMarkovChain(genre, True)
    markovChain.read_markov_chain_from_file(genre)
    #print(len(markovChain.get_all_status()))
    #markovChain.spit_out_all_possibility()
    print(markovChain.run('im', 5))



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
    # parse post request from js
    parser = reqparse.RequestParser()
    parser.add_argument('genre', type=str)
    parser.add_argument('key', type=str)
    parser.add_argument('tonality', type=str)
    parser.add_argument('numChords', type=int)
    args = parser.parse_args()
    
    # BAD CODE, HERE UNTIL MARKOV CHAIN GETS REFACTORED
    melodyNotes = []
    x = 0
    while (x < args.numChords):
        melodyNotes.append(['a'])
        x += 1

    # try to create chords using the data from js request
    #try:
    chords = findAllChords(args.key, genre_map.get(args.genre + '_' + args.tonality).run(args.numChords, melodyNotes))
    return {
        'resultStatus': 'SUCCESS',
        'chords': chords,
      }
#    # except:
#         return {
#             'resultStatus': 'FAILURE',
#             'chords': ['Request', 'Failed']
#         }

api.add_resource(livePerformanceApi, '/flask/getchords')

#SONG WRITING API
class songWritingApi(Resource):
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
    # parse post request from js
    parser = reqparse.RequestParser()
    parser.add_argument('genre', type=str)
    parser.add_argument('key', type=str)
    parser.add_argument('tonality', type=str)
    parser.add_argument('numChords', type=int)
    parser.add_argument('melodyNotes', type=list)
    args = parser.parse_args()

    # try to create chords using the data from js request
    try:
        chords = findAllChords(args.key, genre_map.get(args.genre + '_' + args.tonality).run(args.numChords, args.melodyNotes))
        chordNotes = []
        for c in chords:
            chordNotes.append(getNotesFromChordName(c))
        return {
            'resultStatus': 'SUCCESS',
            'chords': chords,
            'chordNotes': chordNotes
        }
    except:
        return {
            'resultStatus': 'FAILURE',
            'chords': ['Request', 'Failed']
        }

api.add_resource(songWritingApi, '/flask/getchordssw')