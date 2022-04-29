import React, { useEffect, useRef, useState } from "react";
import { parseBars, getFirstChannel, getNoteData,noteDictionary} from "../../midiparser-backend";
import './MidiInput.css';
import PianoRoll from "react-piano-roll";
import { FilePicker } from "../reusable/FilePicker/FilePicker";
import { LocalStoragePicker } from "../reusable/LocalStoragePicker/LocalStoragePicker";
const MidiConvert = require('midiconvert')




//global for handling the midi data
let midiFile = {
  bpm: 120,
  measures: 0,
  timeSig: [4, 4],
  notes: [],
  chords: [],
  parsedBars: [],
  midi: {}
}


/**
 * MidiInput is the main component of the Songwriting tool. The piano roll and the file pickers are housed here.
 */
export const MidiInput = (props) => {

  //data from the midi file
  const [bpm, setBPM] = useState(null)
  const [measures, setMeasures] = useState(null);
  const [timeSig, setTimeSig] = useState(null);
  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState("");

  //the PianoRoll object
  const [pianoRoll, setPianoRoll] = useState(null);

  //file handlers
  const [currFile, setCurrFile] = useState("No file selected");
  const [file, setFile] = useState(null);

  
  /**
   * Takes in midi content from the file (either file upload or local storage) and sets the content. 
   * This function also passes the content to a helper to be parsed.
   * @param {string} content 
   */
  function updateContent(content) {
      setPianoRoll();
      setContent(content);
      uploadMidi(content); 
  }

  //takes values from the global and updates the midi states when a new file is uploaded
  useEffect(() => {
    updateMidi(midiFile);
  }, [content]);


/**
 * Funciton to set the piano roll. If chords is false, only the melody notes will appear on 
 * the piano roll. If it is true, the melody and the chords will appear on the piano roll.
 * 
 * @param {boolean} chords 
 * @returns PianoRoll component
 */
  function updatePianoRoll(chords) {
    let pianoNotes = chords ? midiFile.notes.concat(midiFile.chords) : midiFile.notes;
    setPianoRoll(null);
    let pianoRoll = <PianoRoll
      width={1620}
      height={500}
      zoom={midiFile.measures}
      resolution={1}
      bpm={midiFile.bpm}
      pianoKeyWidth={125}
      gridLineColor={0x333333}
      blackGridBgColor={0x1e1e1e}
      whiteGridBgColor={0x282828}
      time={props.time}
      noteFormat={"String"}
      noteData={pianoNotes}
    />

    return pianoRoll
  }

// in charge of setting the piano roll
  useEffect(() => {
    setPianoRoll(null)
    let pRoll;
    if (props.chordNotes !== undefined && props.chordNotes.length !== 0 && !props.isLoading) {
      addChords(midiFile)
      pRoll = updatePianoRoll(true);
    } else if (pianoRoll === null) {
      pRoll = updatePianoRoll(false); 
    } else {
      setPianoRoll(null)
    }
    setPianoRoll(pRoll);
  }, [props.isLoading,]);


  /**
   * Function that passes in the gloabl midiFile to the set states. From here, props from the main 
   * Songwriting Tool Component are also updated. The api gets triggered by this call
   * @param {midiFile} midi 
   */
  function updateMidi(midi) {

    //bpm/tempo
    setBPM(midi.bpm);
    props.setTempo(midi.bpm);

    //number of measures
    setMeasures(midi.measures);
    props.setChordNum(midi.measures);

    //time signatures
    setTimeSig(midi.timeSig);
    props.setTimeSigNum(midi.timeSig[0]);
    props.setTimeSigDenom(midi.timeSig[1]);

    //melody and notes by measure
    props.setMelody(midi.parsedBars);
    props.setNotesByMeasure(midi.midi);

    //calls the api to generate new chords
    props.setUpdateChords(props.updateChords + 1);

    //sets the notes for the piano roll
    setNotes(midi.notes);
  }


/**
 * Helper function to add the generated chords to the piano roll
 * @param {midiFile} midi 
 */
  function addChords(midi) {
    midi.chords = [];
    if (props.chordNotes !== undefined && props.chordNotes.length !== 0) {
      for (let i = 0; i < props.chordNotes.length; i++) {
        for (let j = 0; j < props.chordNotes[i].length; j++) {
          let note = [`${i}:0:0`, props.chordNotes[i][j] + 3, "1n"]
          midi.chords.push(note);
        }
      }
    }
  }


  return <div className="MidiInput">
    <table className="MidiContentUpload">
      <tr>
        <td><FilePicker f={updateContent} currFile={currFile} currFileChange={setCurrFile} file={file} midiChange={setFile}></FilePicker></td>
        <td><LocalStoragePicker f={updateContent} currFile={currFile} currFileChange={setCurrFile}></LocalStoragePicker></td>
        <td>{currFile}</td>
        </tr>
      </table>
    {pianoRoll}
      
    </div>
}

/**
 * Parses the binary string and updates the global midiFile.
 * @param {string} content 
 * @returns 
 */
function uploadMidi(content) {
 
  //parses binary string into a Midi JSON
  var midi = MidiConvert.parse(content);
 

  //getting the midi data
  const timeSig = midi.header.timeSignature;
  const bpm = midi.header.bpm;
  const notes = getFirstChannel(midi.tracks);
  const measureDuration = (240 / bpm) * (timeSig[0] / timeSig[1]);
  const parsedBars = parseBars(notes, measureDuration);
 
  //setting the midi data
  midiFile.notes = getNoteData(measureDuration, parsedBars);
  midiFile.bpm = bpm;
  midiFile.timeSig = timeSig;
  midiFile.measures = Object.keys(parsedBars).length;
  midiFile.parsedBars = noteDictionary(parsedBars)
  midiFile.midi = parsedBars;

}
