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

if __name__ == '__main__':
    # system for parsing csvs and creating markov chain
    
    genre_map = {}

    # to read the csv file
    file = open('midiparser-backend/dataWithRomanAndMode.csv')
    csvreader = csv.reader(file)
    header = next(csvreader)
    for row in csvreader:
        genre = str(row[4])
        currMarkov = ""
        # check if there is an existing mc, make one if not
        if genre_map.keys().__contains__(genre):
            currMarkov = genre_map.get(genre)
        else:
            currMarkov = secondOrderMarkovChain()

        chords = row[8].split(',')
        prev2Chord = None
        prevChord = None
        for chord in chords:
            currMarkov.add_one_event(prev2Chord, prevChord, chord)
        genre_map.update(genre, currMarkov)
    
    for key in genre_map.keys():
        genre_map.get(key).convertToFile(genre)
    # create files for each markov chain
