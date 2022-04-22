from urllib.parse import MAX_CACHE_SIZE
from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from api.TestApi import TestApi
#from livePerformanceApi import livePerformanceApi
from midiparser_backend.src.secondOrderMarkovChain import Any, secondOrderMarkovChain
import csv

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)  # comment this on deployment
api = Api(app)
genre_map = {}

#LIVE PERFORMANCE API
class livePerformanceApi(Resource):
  def get(self, genre, num_chords):
    # parser = reqparse.RequestParser()
    # parser.add_argument('genre', type=str)
    # parser.add_argument('numChords', type=int)
    # args = parser.parse_args()

    chords = genre_map.get(args.genre)
    return {
      'resultStatus': 'SUCCESS',
      'chords': chords
      }

  def post(self):
    print(self)
    parser = reqparse.RequestParser()
    parser.add_argument('type', type=str)
    parser.add_argument('message', type=str)
    parser.add_argument('chords')

    args = parser.parse_args()

    print(args)
    # note, the post req from frontend needs to match the strings here (e.g. 'type and 'message')

    request_type = args['type']
    request_json = args['message']
    # ret_status, ret_msg = ReturnData(request_type, request_json)
    # currently just returning the req straight
    ret_status = request_type
    ret_msg = request_json

    if ret_msg:
      message = "Your Message Requested: {}".format(ret_msg)
    else:
      message = "No Msg"
    
    final_ret = {"status": "Success", "message": message}

    return final_ret

@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


api.add_resource(TestApi, '/flask/hello')
api.add_resource(livePerformanceApi, '/flask/getchords/<genre>/<num_chords>', endpoint = 'getchords')

def train_markov_chains():
    # system for parsing csvs and creating markov chain
    print('training markov chains')

    # to read the csv file
    file = open('midiparser_backend/dataWithRomanAndMode.csv')
    csvreader = csv.reader(file)
    header = next(csvreader)
    for row in csvreader:
        genre = str(row[4]).replace('/', ' & ')
        currMarkov = ""
        # check if there is an existing markov chain, make one if not
        if genre_map.keys().__contains__(genre):
            currMarkov = genre_map.get(genre)
        else:
            currMarkov = secondOrderMarkovChain(genre, True)

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
        genre_map[genre] = currMarkov

    for key in genre_map.keys():
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

def generalize_genres(genre: str):
    if (genre == 'Acoustic Blues' or genre == 'Blues & Folk' or genre == 'Blues-Rock' or genre == 'Soul'):
        return 'R&B'
    elif (genre == 'Classic Rock' or genre == 'College Rock' or genre == 'Glam Rock' or genre == 'Indie Rock' 
    or genre == 'Pop' or genre == 'Rock' or genre == 'Rock & Roll' or genre == 'Southern Rock' or genre == 'Easy Listening'
    or genre == 'Hard Rock' or genre == 'Ska' or genre == 'Classic Rock' or genre == 'Country'):
        return 'Pop & Rock'
    elif (genre == 'Christian Rock' or genre == 'Inspirational' or genre == 'Praise & Worship'):
        return "Religious Music"
    elif (genre == 'Dance' or genre == 'Dance & Electronic' or genre == 'Disco' or genre == 'House'):
        return "Dance & EDM"
    elif (genre == 'Jazz' or genre == 'Vocal Jazz'):
        return "Jazz"
    elif (genre == 'Alternative Folk' or genre == 'Adult Alternative' or genre == 'Alternative' or genre == 'Classic Rock' or genre == 'Prog-Rock'):
        return "Alternative"
    elif (genre == 'Hip-Hop' or genre == 'Hip-Hop & Rap'):
        return "Hip-Hop"
    elif (genre == 'Grunge' or genre == 'Punk' or genre == 'Metal'):
        return 'Punk & Metal'
    elif (genre == ''):
        return 'Random'
    else:
        return genre

#read_markov_chain('Dance')
print('trying to run from global variable')
#genre_map.get('Dance').run('im', 3)
genre_map.get('Rock').run('i', 5)

