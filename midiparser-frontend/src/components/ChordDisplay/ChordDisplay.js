import React, { useState } from "react";
import './ChordDisplay.css';
import { LineScalePulseOut } from "react-pure-loaders";

export const ChordDisplay = (props) => {
    return <div className="LiveTopContainer">
        <div className="ChordContainer">
            <div className="ChordHeader">
                <text>Current Chord</text>
            </div>
            <div className="ChordText">
                {props.isLoading? <LineScalePulseOut size={200} width={200} height={200} color={'#000'} loading={props.isLoading}/> : <text>{props.chordName}</text>}
            </div>
            <div className='ProgressionText'>
                {props.isLoading? <LineScalePulseOut color={'#000'} loading={props.isLoading}/> : <text>{"Chord Progression: " + props.progression.join(", ").toString()}</text>}
            </div>
        </div>
        <div className="NextChordContainer">
            <div className="ChordHeader">
                <text>Next Chord</text>
            </div>
            <div className="ChordText">
                {props.isLoading? <LineScalePulseOut size={200} color={'#000'} loading={props.isLoading}/> : <text>{props.nextChordName}</text>}
            </div>
        </div>
    </div>;
}