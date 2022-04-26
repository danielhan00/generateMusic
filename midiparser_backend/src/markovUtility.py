import csv
import re
from music21 import *
<<<<<<< HEAD

=======
from pychord import Chord
>>>>>>> 3dcdb825fc6d3408e22e97415b2b6c8406bae211
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
            chordName = scVague.romanNumeral(prefix + substring).root().name
            chordName = chordName.replace('Fb', 'E').replace('Cb', 'B').replace(
                'Fb', 'E').replace('E#', 'F').replace('B#', 'C')
            if (chordName.count('-') > 1 or chordName.count('#') > 1):
                return pitch.Pitch(chordName).getEnharmonic().name.replace('-', "b") + suffix
            else:
                return chordName.replace('-', "b") + suffix

            # return replaceChordNameHelper(scVague.romanNumeral(prefix + substring).root().name) + suffix

# def replaceChordNameHelper(chord: str):
#     nameList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
#     if '##' in chord:
#         nameIndex = nameList.index(chord[0])
#         chord = chord.replace(nameList[nameIndex] + '##', nameList[(nameIndex + 1) % len(nameList)])
#     elif '--' in chord:
#         nameIndex = nameList.index(chord[0])
#         chord = chord.replace(nameList[nameIndex] + '--', nameList[(nameIndex - 1) % len(nameList)])
#     return chord.replace('-', "b").replace('Fb', 'E').replace('Cb', 'B').replace('Fb', 'E').replace('E#', 'F').replace('B#', 'C')

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

<<<<<<< HEAD

#findAllChords("Bb", romanSplit)
=======
def getSuffix(chord):
    suffix = ''
    perentheses = ''
    if chord.find('(') != -1:
        peren = chord[chord.find("("):chord.find(")")+1]
        chord = chord.replace(peren, '')
        perentheses = re.sub("[()]", "", peren)

    if chord.find('mmaj') != -1:
        suffix = chord[chord.find('mmaj'):]
        chord = chord.replace(suffix, '')
    if chord.find('maj') != -1:
        suffix = chord[chord.find('maj'):]
        chord = chord.replace(suffix, '')
    if chord.find('aug') != -1:
        suffix = chord[chord.find('aug'):]
        chord = chord.replace(suffix, '')
    if chord.find('dim') != -1:
        suffix = chord[chord.find('dim'):]
        chord = chord.replace(suffix, '')
    if chord.find('sus') != -1:
        suffix = chord[chord.find('sus'):]
        chord = chord.replace(suffix, '')
    if chord.find('add') != -1:
        suffix = chord[chord.find('add'):]
        chord = chord.replace(suffix, '')
    if chord.find('m') != -1:
        suffix = chord[chord.find('m'):]
        chord = chord.replace(suffix, '')

    if chord.find('b') != -1:
        chord = chord.replace('b', '-')
    if bool(re.search(r'\d', chord)):
        regex = re.compile(r'(\d+|\s+)')
        splitArray = regex.split(chord)
        chord = splitArray[0]
        suffix = splitArray[1] + suffix
    return chord, suffix+perentheses

# Turns a chord name into an array of the notes within the chord
def getNotesFromChordName(name):
    chordNotes = []
    if name.find('mmaj') != -1:
        chordObj = Chord(name[: name.find('maj')])
        chordNotes = chordObj.components()
        chordObj2 = Chord(name[: name.find('m')] + name[name.find('maj') :])
        chordNotes.append(chordObj2.components()[3])
        if name.find('9') != -1:
            chordNotes.append(chordObj2.components()[4])
    else:
        chordObj = Chord(name)
        chordNotes = chordObj.components()
    return chordNotes
# print(getNotesFromChordName("C"))
# print(getNotesFromChordName("Cmaj7"))
# print(getNotesFromChordName("Abadd9"))
# print(getNotesFromChordName("C#m"))
# print(getNotesFromChordName("Eaug"))
# print(getNotesFromChordName("Bsus2"))
# print(getNotesFromChordName("Dmmaj7"))
# print(getNotesFromChordName("Bbmmaj9"))

def validateChords(key, mode, chord, melodyNotes):
    notesInChord = getNotesFromChordName(chord)
    chordLength = len(notesInChord)
    count = 0
    scVague = scale.ConcreteScale()
    scVague.abstract = scale.AbstractDiatonicScale(mode)
    scVague.tonic = pitch.Pitch(key)
    keyPitches = [p.name for p in scVague.getPitches()]
    chord, suffix = getSuffix(chord)

    if (chord.count('-') > 1 or chord.count('#') > 1):
        chord = pitch.Pitch(chord).getEnharmonic().name

    if(melodyNotes[0] not in notesInChord):
        return False

    for note in notesInChord:
        if(note not in keyPitches):
            return False
    for note in notesInChord:
        if (note in melodyNotes):
            count += 1
    if(count/chordLength >= .5):
        #print(count/chordLength)
        return True
    else:
        return False

# print(validateChords("C", "Major", "C", ["C", "E", "D", "F"]))
# print(validateChords("C", "Major", "C", ["B", "E", "D", "F"]))
# print(validateChords("C", "Major", "C", ["C", "E", "G", "F"]))
# print(validateChords("C", "Major", "C", ["C#", "E", "G", "F"]))

# #findAllChords("Bb", romanSplit)
>>>>>>> 3dcdb825fc6d3408e22e97415b2b6c8406bae211


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
