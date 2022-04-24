import React, {useState} from "react";
import { TransportBar } from "../TransportBar/TransportBar";
import { MidiInput } from "../MidiInput/MidiInput";
import './SongWritingTool.css'


export const SongWritingTool =(props)=>{

    const [genre, setGenre] = useState('Placeholder');
    const [keyLetter, setKeyLetter] = useState('A');
    const [keyQuality, setKeyQuality] = useState('Major');
    const [content, setContent] = useState("");
    const [tempo, setTempo] = useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [timeSigDenom, setTimeSigDenom] = useState(4);


    
    return <div className="Container">
        <MidiInput content={content} ></MidiInput>
       <TransportBar genre={genre} genreChangeClick={setGenre} 
        keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
        timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom}></TransportBar>
    </div>;
}