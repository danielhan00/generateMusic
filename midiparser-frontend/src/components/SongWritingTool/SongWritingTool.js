import React, {useState} from "react";
import { TransportBar } from "../TransportBar/TransportBar";
import { MidiInput } from "../MidiInput/MidiInput";
import './SongWritingTool.css'

export const SongWritingTool =(props)=>{

    const [genre, setGenre] = useState('Placeholder');
    
    return <div className="Container">
        <MidiInput></MidiInput>
       <TransportBar genre={props.genre} tempo={props.tempo} timeSig={props.timeSig} key={props.key}></TransportBar>
    </div>;
}