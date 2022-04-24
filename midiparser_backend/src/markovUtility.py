import csv
import re
from music21 import *

romanTest = "vi,#ivm,ii,vi,vi,#ivm,ii,vi,ii,vi,ii,vi,#ivm,iii,vi,#im7,ii,ii6,iii,vi,vi,#ivm,ii,vi,ii,vi,ii,vi,#ivm,iii,vi,#im7,ii,ii6,iii,vi,#ivm,ii,vi,iii,#ivm,ii,vi,iii,#ivm,ii,vi,iii,#ivm,ii,vi,iii,ii,vi,ii,vi,#ivm,iii,#im7,iii,ii,ii6,iii,vi,ii,iii,#ivm7"
romanSplit = romanTest.split(',')


def chordNameHelper(r, key, mode):
    romanList = ["vii", "vi",  "iv", "v", "iii", "ii", "i"]
    scVague = scale.ConcreteScale()
    scVague.abstract = scale.AbstractDiatonicScale(mode)
    scVague.tonic = pitch.Pitch(key)

    for substring in romanList:
        if substring in r:
            splitArray = r.split(substring, 1)
            prefix = splitArray[0]
            suffix = splitArray[1]
            return replaceChordNameHelper(scVague.romanNumeral(prefix + substring).root().name) + suffix

def replaceChordNameHelper(chord: str):
    nameList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    if '##' in chord:
        nameIndex = nameList.index(chord[0])
        chord = chord.replace(nameList[nameIndex] + '##', nameList[(nameIndex + 1) % len(nameList)])
    elif '--' in chord:
        nameIndex = nameList.index(chord[0])
        chord = chord.replace(nameList[nameIndex] + '--', nameList[(nameIndex - 1) % len(nameList)])
    return chord.replace('-', "b").replace('Fb', 'E').replace('Cb', 'B').replace('Fb', 'E').replace('E#', 'F').replace('B#', 'C')

def findSingleChord(roman, key):
    key.replace('b', "-")
    if key.find('m') != -1:
        chord = chordNameHelper(roman, key.replace("m", ''), 'minor')
        ##print(key+': '+roman+" " + chord)
        return chord
    else:
        chord = chordNameHelper(roman, key, 'major')
        #print(key+': '+roman+" " + chord)
        return chord


def findAllChords(key, list):
    allChords = []
    for r in list:
        allChords.append(findSingleChord(r, key))
    #print(allChords)
    return allChords


#findAllChords("Bb", romanSplit)


# file = open(
#     '/midiparser/midiparser_backend/artistsAndGenres.csv')
# csvreader = csv.reader(file)
# header = next(csvreader)
# modeColumn = ['mode']

# romanColumn = ['roman numerals']
# count = 1
# for row in csvreader:
#     tonality = row[5].replace('b', "-")
#     chords = row[7].split(',')
#     romanAnalysis = []
#     romanString = ''
#     mode = ''
#     if(tonality != ''):
#         if tonality.find('m') != -1:
#             mode = 'Minor'
#             tonality = tonality.replace('m', '').lower()
#         else:
#             mode = 'Major'
#         for ch in chords:
#             suffix = ''
#             perentheses=''
#             chrd = ch

#             try:

#                 if chrd.find('/') != -1:
#                     chrd = ch.split('/')[0]
#                 if chrd.find('(') != -1:
#                     print(chrd)
#                     peren = chrd[chrd.find("("):chrd.find(")")+1]
#                     chrd = chrd.replace(peren, '')
#                     perentheses= re.sub("[()]", "", peren)
#                     print(perentheses)
#                 if chrd.find('mmaj') != -1:
#                     suffix = chrd[chrd.find('mmaj'):]
#                     chrd = chrd.replace(suffix, '')
#                 if chrd.find('maj') != -1:
#                     suffix = chrd[chrd.find('maj'):]
#                     chrd = chrd.replace(suffix, '')
#                 if chrd.find('aug') != -1:
#                     suffix = chrd[chrd.find('aug'):]
#                     chrd = chrd.replace(suffix, '')
#                 if chrd.find('dim') != -1:
#                     suffix = chrd[chrd.find('dim'):]
#                     chrd = chrd.replace(suffix, '')
#                 if chrd.find('sus') != -1:
#                     suffix = chrd[chrd.find('sus'):]
#                     chrd = chrd.replace(suffix, '')
#                 if chrd.find('add') != -1:
#                     suffix = chrd[chrd.find('add'):]
#                     chrd = chrd.replace(suffix, '')
#                 if chrd.find('m') != -1:
#                     suffix = chrd[chrd.find('m'):]
#                     chrd = chrd.replace(suffix, '')

#                 if chrd.find('b') != -1:
#                     chrd = chrd.replace('b', '-')
#                 if bool(re.search(r'\d', chrd)):
#                     regex = re.compile(r'(\d+|\s+)')
#                     splitArray = regex.split(chrd)
#                     chrd = splitArray[0]
#                     suffix = splitArray[1] + suffix

#                 rn = roman.romanNumeralFromChord(
#                     chord.Chord(chrd), tonality).figure + suffix + perentheses

#                 romanAnalysis.append(rn)

#             except:
#                 raise Exception(ch, "is not valid")

#         romanString = ",".join(romanAnalysis)

#     romanColumn.append(romanString)
#     modeColumn.append(mode)
#     print(tonality, ": record added", count, romanString)
#     count += 1


# def add_col_to_csv(csvfile, fileout, new_list):
#     with open(csvfile, 'r') as read_f, \
#             open(fileout, 'w', newline='') as write_f:
#         csv_reader = csv.reader(read_f)
#         csv_writer = csv.writer(write_f)
#         i = 0
#         for row in csv_reader:
#             row.append(new_list[i])
#             csv_writer.writerow(row)
#             i += 1
#     print('done!')
