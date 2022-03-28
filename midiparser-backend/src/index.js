const { detect } = require('@tonaljs/chord-detect')
const { Pcset } = require('@tonaljs/tonal')
const MidiConvert = require('midiconvert')
const { Midi, Key, Scale } = require('@tonaljs/tonal')

//sample data for testing
var key = 'C'
var mode = 'Minor'
var genre = 'Rock'

let fs = require('fs')
fs.readFile('testmid.mid', 'binary', function (err, midiBlob) {
  if (!err) {
    midi = MidiConvert.parse(midiBlob)
    notes = getFirstChannel(midi.tracks)
    bpm = midi.header.bpm
    timeSignature = midi.header.timeSignature
    meausureDuration = (240 / bpm) * (timeSignature[0] / timeSignature[1])
    bars = parseBars(notes, meausureDuration)
    notesInBar = noteDictionary(bars)
    //console.log(meausureDuration)
    //console.log(numberToNoteNames(notes))
  } else {
    console.log('error')
  }
})

function notesInKey(key) {
  return Scale.get(key).notes
}

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

function noteDictionary(bars) {
  let dict = new Object()
  for (const [key, value] of Object.entries(bars)) {
    dict[key] = numberToNoteNames(value)
    //console.log(key, dict[key])
  }
  return dict
}

function numberToNoteNames(noteArray) {
  const notes = []
  for (var i = 0; i < noteArray.length; i++) {
    const noteName = Midi.midiToNoteName(noteArray[i].midi)
    //console.log(noteArray[i])
    notes.push(noteName)
  }

  return notes
}
function parseBars(noteArray, duration) {
  let dict = new Object()
  let bar = duration
  let count = 1
  let currBar = []

  for (var i = 0; i < noteArray.length; i++) {
    if (noteArray[i].time < bar) {
      currBar.push(noteArray[i])
      if (noteArray[i].time + noteArray[i].duration > bar) {
        dict[count] = currBar
        currBar = []
        count++
        currBar.push(noteArray[i])
        bar += duration
      }
    } else {
      dict[count] = currBar
      currBar = []
      count++
      currBar.push(noteArray[i])
      bar += duration
    }
  }
  dict[count] = currBar

  return dict
}

function getChords(key, mode) {
  if (mode.toLowerCase() == 'major') {
    chords = Key.majorKey(key).chords
    console.log('major', chords)
    return chords
  }
  //minor funtion not working
  if (mode.toLowerCase() == 'minor') {
    minorChords = Key.minorKey('C').chords
    console.log('minor', minorChords)
    return minorChords
  }
}
function getFirstChannel(tracks) {
  for (var i = 0; i < tracks.length; i++) {
    if (tracks[i].notes.length != 0) {
      return tracks[i].notes
    }
  }
}
getChords(key, mode)
