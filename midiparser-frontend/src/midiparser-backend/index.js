const { detect } = require('@tonaljs/chord-detect')
const { Pcset, Tonal } = require('@tonaljs/tonal')
const MidiConvert = require('midiconvert')
const { Progression } = require('@tonaljs/tonal')
const { Midi, Key, Scale } = require('@tonaljs/tonal')
const Papa = require('papaparse')

//sample data for testing
var key = 'C'
var mode = 'Major'
var genre = 'Rock'

let fs = require('fs')
function readMidi(fileName) {
  fs.readFile(fileName, 'binary', function (err, midiBlob) {
    if (!err) {
      midi = MidiConvert.parse(midiBlob)
      notes = getFirstChannel(midi.tracks)
      bpm = midi.header.bpm
      timeSignature = midi.header.timeSignature
      meausureDuration = (240 / bpm) * (timeSignature[0] / timeSignature[1])
      bars = parseBars(notes, meausureDuration)
      notesInBar = noteDictionary(bars)
      console.log(meausureDuration)
      //console.log(numberToNoteNames(notes))

      return midiInfo
    } else {
      console.log('error')
    }
  })
}
// returns array of notes in given key
function notesInKey(key) {
  return Scale.get(key).notes
}

// given array of note objects, return array of corresponding note names based on midi numbers
function numberToNoteNames(noteArray) {
  const notes = []
  for (var i = 0; i < noteArray.length; i++) {
    const noteName = Midi.midiToNoteName(noteArray[i].midi)
    notes.push(noteName)
  }
  //console.log(notes)
  //console.log(detect(notes))
  return notes
}

// creates a dictionary of barDuration number corresponding to note names in that barDuration
function noteDictionary(bars) {
  let dict = new Object()
  for (const [key, value] of Object.entries(bars)) {
    dict[key] = numberToNoteNames(value)
    //console.log(key, dict[key])
  }
  return dict
}

// given array of note objects, and duration, note objects are put into a dictionary, with barDuration number as key
function parseBars(noteArray, duration) {
  let dict = new Object()
  let barDuration = duration
  let bar = 0
  let currBar = []

  for (var i = 0; i < noteArray.length; i++) {
    if (noteArray[i].time < barDuration) {
      currBar.push(noteArray[i])
      if (noteArray[i].time + noteArray[i].duration > barDuration) {
        dict[bar] = currBar
        currBar = []
        bar++
        currBar.push(noteArray[i])
        barDuration += duration
      }
    } else {
      dict[bar] = currBar
      currBar = []
      bar++
      currBar.push(noteArray[i])
      barDuration += duration
    }
  }
  dict[bar] = currBar

  return dict
}

// returns array of chords in the key
function getChords(key, mode) {
  if (mode.toLowerCase() == 'major') {
    chords = Key.majorKey(key).chords
    //console.log('major', chords)
    return chords
  }
  //minor function not working
  if (mode.toLowerCase() == 'minor') {
    minorChords = Key.minorKey('C').chords
    //console.log('minor', minorChords)
    return minorChords
  }
}

//returns first channel with midi information
function getFirstChannel(tracks) {
  for (var i = 0; i < tracks.length; i++) {
    if (tracks[i].notes.length != 0) {
      return tracks[i].notes
    }
  }
}

const file = fs.createReadStream('midiparser-backend/Chords.csv')
var csvData = []
Papa.parse(file, {
  header: true,
  step: function (result) {
    csvData.push(result.data)
  },
  complete: function (results, file) {
    console.log('Complete', csvData.length, 'records.')
    for (var i = 0; i < csvData.length; i++) {
      chords = csvData[i].chords.split(',')
      tonality = csvData[i].tonality
      if (tonality != '') {
        //console.log(tonality, chords)
        console.log(tonality, Progression.toRomanNumerals(tonality, chords))
      }
    }
  },
})

getChords(key, mode)
console.log(readMidi('testmid.mid'))

console.log(Progression.toRomanNumerals('D', ['D']))
