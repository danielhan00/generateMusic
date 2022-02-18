const { detect } = require('@tonaljs/chord-detect')
const MidiConvert = require('midiconvert')
const { Midi, Interval, Note, Scale } = require('@tonaljs/tonal')

let fs = require('fs')
fs.readFile('testmid.mid', 'binary', function (err, midiBlob) {
  if (!err) {
    var midi = MidiConvert.parse(midiBlob)
    notes = midi.tracks[1].notes
    bpm = midi.header.bpm
    numberToNoteNames(notes)
    console.log(notes)
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

console.log(notesInKey('C major'))
