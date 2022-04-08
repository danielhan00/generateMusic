import React, { useEffect, useRef, useState } from "react";
//import { parseBars } from "../../../../midiparser-backend/src";
import './MidiInput.css';
import PianoRoll from "react-piano-roll";
import { FilePicker } from "../reusable/FilePicker/FilePicker";
import { SuggestionBar } from "../SuggestionBar/SuggestionBar";
import { LocalStoragePicker } from "../reusable/LocalStoragePicker/LocalStoragePicker";
const MidiConvert = require('midiconvert')


let midiFile = {
  bpm: 120,
  measures: 12,
  timeSig: [4, 4],
  notes: []
}

let midiDuration = {

}



export const MidiInput = (props) => {
  const [bpm, setBPM] = useState(null)
  const [measures, setMeasures] = useState(null);
  const [timeSig, setTimeSig] = useState(null);
  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState("");
  const [pianoRoll, setPianoRoll] = useState();
  const [currFile, setCurrFile] = useState("No file selected");


  function updateContent(content) {
    setPianoRoll();
    setContent(content);
    uploadMidi(content)
  }

  useEffect(() => {
    updateMidi(midiFile);
  }, [props, content]);

  useEffect(() => {
    let pianoRoll =     <PianoRoll
    width={1600}
    height={500}
    zoom={midiFile.measures}
    resolution={1}
      bpm={bpm}
    pianoKeyWidth={125}
    gridLineColor={0x333333}
    blackGridBgColor={0x1e1e1e}
    whiteGridBgColor={0x282828}
    noteFormat={"MIDI"}
    noteData={[
      ["0:0:0", 60, "1n"],
      ["0:0:0", 61, "2n"],
      ["0:0:0", 62, "3n"],
      ["0:0:0", 63, "4n"],
      ["0:2:0", 64, "8n"],
      ["0:3:0", 65, "16n"],
      ["0:0:0", 66, "32n"],
    ]}
    /> 
    setPianoRoll(pianoRoll);

  },[content])


  function updateMidi(midi) {
    setBPM(midi.bpm);
    setMeasures(midi.measures);
    setTimeSig(midi.timeSig)
  }



  
  return <div className="MidiInput">
    <table className="MidiContentUpload">
      <tr>
        <td><FilePicker f={updateContent} currFile={currFile} currFileChange={setCurrFile}></FilePicker></td>
        <td><LocalStoragePicker f={updateContent} currFile={currFile} currFileChange={setCurrFile}></LocalStoragePicker></td>
        <td>{currFile}</td>
        </tr>
      </table>
    {pianoRoll}
    <SuggestionBar  measures={measures}/>

      
    </div>
}

function uploadMidi(content) {
  console.log(content);
  var midi = MidiConvert.parse(content);
  console.log(midi);
  const timeSig = midi.header.timeSignature;
  //setBPM(timeSig);
  const bpm = midi.header.bpm;
  //setTimeSig(bpm);
  const notes = midi.tracks[1].notes;
  console.log("time Sig: " + timeSig);
  console.log("bpm: " + bpm);
  const measureDuration = (240 / bpm) * (timeSig[0] / timeSig[1]);


  //transportHelp(bpm, timeSig[0], notes[1].time);
  console.log(parseBars(notes, measureDuration));
  //setMeasures(Object.keys(parseBars(notes, meausureDuration)).length);

  midiFile[bpm] = bpm;
  midiFile.timeSig = timeSig;
  midiFile.measures = Object.keys(parseBars(notes, measureDuration)).length;

  console.log(midiFile[bpm]);
  return {
    bpm: bpm,
    timeSig: timeSig,
    measures: Object.keys(parseBars(notes, measureDuration)).length,
  }
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
/*
TO:DO
-parse out midi stuff for piano roll
-css
-moving suggestion bar



*/