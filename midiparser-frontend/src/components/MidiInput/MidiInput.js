import React, { useRef, useState } from "react";
import './MidiInput.css';
import PianoRoll from "react-piano-roll";
import { FilePicker } from "../reusable/FilePicker/FilePicker";
import MidiParser from "midi-parser-js";
const MidiConvert = require('midiconvert')


export const MidiInput = (props) => {
    const midiFile = useRef(null);
  
    return <div className="MidiInput">
        {/*<button onClick={ImportFromFileBodyComponent}>Upload Midi File</button>
        <button onClick={writeMidi}>Create New Midi</button>*/}
        <FilePicker f={uploadMidi}></FilePicker>
        <PianoRoll
            width={1500}
            height={700}
            zoom={6}
            resolution={2}
            gridLineColor={0x333333}
            blackGridBgColor={0x1e1e1e}
            whiteGridBgColor={0x282828}
            noteFormat={"MIDI"}
            noteData={[
                ["0:0:0", 60, "2n"],
                ["0:0:0", 64, "2n"],
                ["0:0:0", 67, "2n"],
                ["0:0:0", 48, "2n"],
                ["0:2:0", 79, "4n"],
                ["0:3:0", 75, "4n"],
                ["6:0:0", 56, "1"],
            ]}
        />

    </div>
}
function uploadMidi(content) {
    console.log(content)
    var midi = MidiConvert.parse(content)
    console.log(midi);
    const timeSig = midi.header.timeSignature;
    const bpm = midi.header.bpm;
    const notes = midi.tracks[1].notes;
    console.log("time Sig: " + timeSig);
    console.log("bpm: " + bpm);
    

    transportHelp(bpm, timeSig[0], notes[1].time);
    
}

function transportHelp(bpm, sig, time) {
    let result = ((bpm * time) / 60) / sig;
    console.log(result)
}

/*
TO:DO
-parse out midi stuff for piano roll
-make suggestions side bar 



*/