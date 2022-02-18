import React, {useState} from "react";
import { LiveInfoBar } from '../LiveInfoBar/LiveInfoBar';
import { ChordDisplay } from '../ChordDisplay/ChordDisplay';
import './LivePerformanceTool.css'

export const LivePerformanceTool =(props)=>{

    return <div className="Container">
        <ChordDisplay className ="ChordContainer" chordName={props.chordName}></ChordDisplay>
        <LiveInfoBar genre={props.genre} tempo={props.tempo} timeSig={props.timeSig} key={props.key} randomness={props.randomness}></LiveInfoBar>
    </div>;
}