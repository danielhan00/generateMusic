from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from api.TestApi import TestApi
from midiparser_backend.src.secondOrderMarkovChain import Any, secondOrderMarkovChain
import csv

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)  # comment this on deployment
api = Api(app)


@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


api.add_resource(TestApi, '/flask/hello')
# api.add_resource(MarkovApi, '/flask/getchords')

# system for parsing csvs and creating markov chain
print('running main')
genre_map = {}

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
        prevChord = chord
        prev2Chord = prevChord
        print(prev2Chord)
        print(prevChord)
        print(chord)
    print(genre)
    print(currMarkov)
    #currMarkov.refresh_mc()
    genre_map[genre] = currMarkov

for key in genre_map.keys():
    genre_map.get(key).write_markov_chain_to_file()
    genre_map.get(key).spit_out_all_possibility()
    print(len(genre_map.get(key).get_happen_time_table()))
    print(key)
# create files for each markov chain

