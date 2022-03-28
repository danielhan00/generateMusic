import React, {useState} from "react";
import { TransportBar } from "../TransportBar/TransportBar";
import { MidiInput } from "../MidiInput/MidiInput";

export const Home =(props)=>{

    const [genre, setGenre] = useState('Placeholder');
    
    return <div className="Container">
        <MidiInput></MidiInput>
       <TransportBar genre={props.genre} tempo={props.tempo} timeSig={props.timeSig} key={props.key}></TransportBar>
    </div>;
}