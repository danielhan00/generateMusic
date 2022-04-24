import React, { useEffect, useRef, useState } from "react";
import { parseBars, getFirstChannel, getNoteData} from "../../midiparser-backend";
import './MidiInput.css';
import PianoRoll from "react-piano-roll";
import { FilePicker } from "../reusable/FilePicker/FilePicker";
import { SuggestionBar } from "../SuggestionBar/SuggestionBar";
import { LocalStoragePicker } from "../reusable/LocalStoragePicker/LocalStoragePicker";
//import * as MIDI from 'midicube';
const MidiConvert = require('midiconvert')





let midiFile = {
  bpm: 120,
  measures: 0,
  timeSig: [4, 4],
  notes: []
}

let player;

export const MidiInput = (props) => {
  const [bpm, setBPM] = useState(null)
  const [measures, setMeasures] = useState(null);
  const [timeSig, setTimeSig] = useState(null);
  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState("");
  const [pianoRoll, setPianoRoll] = useState();
  const [currFile, setCurrFile] = useState("No file selected");
  const [file, setFile] = useState(null);


  const playbackRef = useRef();

  

  function updateContent(content) {
    setPianoRoll();
    setContent(content);
    uploadMidi(content);
    
  }

  useEffect(() => {
    updateMidi(midiFile);
    //loadMidi(file);
  }, [props, content]);

  useEffect(() => {
    let pianoRoll = <PianoRoll
      width={1600}
      height={500}
      zoom={midiFile.measures}
      resolution={1}
      bpm={midiFile.bpm}
      pianoKeyWidth={125}
      gridLineColor={0x333333}
      blackGridBgColor={0x1e1e1e}
      whiteGridBgColor={0x282828}
      ref={playbackRef}
      time={props.time}
      noteFormat={"MIDI"}
      noteData={midiFile.notes}
    />
    setPianoRoll(pianoRoll);

  }, [content])


  function updateMidi(midi) {
    setBPM(midi.bpm);
    setMeasures(midi.measures);
    setTimeSig(midi.timeSig);
    setNotes(midi.notes);
    //setFile(file);

  }

  // var Player = new MidiPlayer.Player(function (event) {
  //   console.log(event);
  // });

  
  let currentTime = 0;


  useEffect(() => {
    window.addEventListener("keydown", ({ key }) => {

    console.log(playbackRef);
      console.log(playbackRef.current);
      // console.log("end: " + player.endTime)
      // console.log(player.currentTime)
      // console.log(player)
      // currentTime = player.currentTime
    //console.log("transport time: " + playbackRef.transportTime);
    //console.log("piano roll time? " + pianoRoll.props.time);
 
      // if (player.currentTime === player.endTime) {
      //   //player.stop()
      //   playbackRef.current.seek();
      // }
      if (key === " ") {
        playbackRef.current.toggle()
        //midiControls("start");
        //toggle(false);
    } else if (key === "Enter") {
      playbackRef.current.seek("0:0:0");
      //midiControls("stop")
        //player.stop();
      
      }
  });
    
}, [playbackRef.current, currentTime])
  


  
  return <div className="MidiInput">
    <table className="MidiContentUpload">
      <tr>
        <td><FilePicker f={updateContent} currFile={currFile} currFileChange={setCurrFile} file={file} midiChange={setFile}></FilePicker></td>
        <td><LocalStoragePicker f={updateContent} currFile={currFile} currFileChange={setCurrFile}></LocalStoragePicker></td>
        <td>{currFile}</td>
        </tr>
      </table>
    {pianoRoll}
    <SuggestionBar  measures={measures}/>

      
    </div>
}


/* function loadMidi(file) {
  console.log("file", file);
  console.log(MIDI.Player)
  console.log(MIDI);
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    onsuccess:
      () => {
        player = new MIDI.Player()
        player.timeWarp = 1;
        if (file != null) {
          player.loadFile(file
, () => {
  console.log("file loaded!")
            player.start();
            }, undefined , err => {console.warn(err)})
          }
        console.log("success!")
      }
  }
)

}

var toggle = function(stop) {
  if (stop) {
    player.stop();
  } else if (MIDI.Player.playing) {
    player.pause(true);
  } else {
    player.resume();
  }
}; */

function uploadMidi(content) {
  console.log(content);
  var midi = MidiConvert.parse(content);
  console.log(midi);
  const timeSig = midi.header.timeSignature;
  //setBPM(timeSig);
  const bpm = midi.header.bpm;
  //setTimeSig(bpm);
  const notes = getFirstChannel(midi.tracks);
  console.log("time Sig: " + timeSig);
  console.log("bpm: " + bpm);
  const measureDuration = (240 / bpm) * (timeSig[0] / timeSig[1]);
  const parsedBars = parseBars(notes, measureDuration);
  console.log("note data: " + getNoteData(measureDuration, parseBars(notes, measureDuration)));
  midiFile.notes = getNoteData(measureDuration, parsedBars);

  //transportHelp(bpm, timeSig[0], notes[1].time);
  console.log(parseBars(notes, measureDuration));
  //setMeasures(Object.keys(parseBars(notes, meausureDuration)).length);
  //console.log(readMidi(content));
  midiFile[bpm] = bpm;
  midiFile.timeSig = timeSig;
  midiFile.measures = Object.keys(parsedBars).length;
  //console.log("num measures" + parseBars(notes, measureDuration))

  
  
  console.log(midiFile[bpm]);
  return {
    bpm: bpm,
    timeSig: timeSig,
    measures: Object.keys(parseBars(notes, measureDuration)).length,
  }
  
}

/*
TO:DO
-play audio
-adding chords to piano roll
  -see lowest note if chord midi number is above -12
-export chords midi



*/