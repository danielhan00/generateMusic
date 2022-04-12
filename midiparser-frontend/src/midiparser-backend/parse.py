import csv
from music21 import *
file = open('midiparser-backend/artistsAndGenres.csv')
csvreader = csv.reader(file)
header = next(csvreader)
modeColumn = ['mode']
romanColumn = ['roman numerals']
count = 1
for row in csvreader:
    tonality = row[5]
    chords = row[7].split(',')
    romanAnalysis = []
    romanString = ''
    mode = ''
    if(tonality != ''):
        if tonality.find('m') != -1:
            mode = 'Minor'
            tonality = tonality.replace('m', '').lower()
        else:
            mode = 'Major'
        for ch in chords:
            suffix = ''
            chrd = ch

            try:

                if chrd.find('/') != -1:
                    chrd = ch.split('/')[0]
                if chrd.find('mmaj') != -1:
                    suffix = chrd[chrd.find('mmaj'):]
                    chrd = chrd.replace(suffix, '')
                if chrd.find('maj') != -1:
                    suffix = chrd[chrd.find('maj'):]
                    chrd = chrd.replace(suffix, '')
                if chrd.find('aug') != -1:
                    suffix = chrd[chrd.find('aug'):]
                    chrd = chrd.replace(suffix, '')
                if chrd.find('dim') != -1:
                    suffix = chrd[chrd.find('dim'):]
                    chrd = chrd.replace(suffix, '')
                if chrd.find('sus') != -1:
                    suffix = chrd[chrd.find('sus'):]
                    chrd = chrd.replace(suffix, '')
                if chrd.find('add') != -1:
                    suffix = chrd[chrd.find('add'):]
                    chrd = chrd.replace(suffix, '')
                if chrd.find('m') != -1:
                    suffix = chrd[chrd.find('m'):]
                    chrd = chrd.replace(suffix, '')
                if chrd.find('(') != -1:
                    perentheses = chrd[chrd.find("("):chrd.find(")")+1]
                    chrd = chrd.replace(perentheses, '')
                    suffix = suffix + perentheses

                if chrd.find('b') != -1:
                    chrd = chrd.replace('b', '-')
                if chrd.find('7') != -1:
                    chrd = chrd.replace('7', '')
                    suffix = '7' + suffix

                rn = roman.romanNumeralFromChord(
                    chord.Chord(chrd), tonality).figure + suffix

                romanAnalysis.append(rn)

            except:
                romanAnalysis.append(ch)

        romanString = ",".join(romanAnalysis)

    romanColumn.append(romanString)
    modeColumn.append(mode)
    print('added record', count)
    count += 1


def add_col_to_csv(csvfile, fileout, new_list):
    with open(csvfile, 'r') as read_f, \
            open(fileout, 'w', newline='') as write_f:
        csv_reader = csv.reader(read_f)
        csv_writer = csv.writer(write_f)
        i = 0
        for row in csv_reader:
            row.append(new_list[i])
            csv_writer.writerow(row)
            i += 1
    print('done!')


add_col_to_csv('midiparser-backend/artistsAndGenres.csv',
               'midiparser-backend/dataWithRoman.csv', romanColumn)
add_col_to_csv('midiparser-backend/dataWithRoman.csv',
               'midiparser-backend/dataWithRomanAndMode.csv', modeColumn)
