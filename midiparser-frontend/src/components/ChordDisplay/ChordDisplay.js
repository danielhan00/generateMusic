import React, { useState } from "react";
import './ChordDisplay.css';

export const ChordDisplay = (props) => {
    return <div className="LiveTopContainer">
        <div className="ChordContainer">
            <div className="ChordHeader">
                <text>Current Chord</text>
            </div>
            <div className="ChordText">
                <text>{props.chordName}</text>
            </div>
        </div>
        <div className="NextChordContainer">
            <div className="ChordHeader">
                <text>Next Chord</text>
            </div>
            <div className="ChordText">
                <text>{props.nextChordName}</text>
            </div>
        </div>
    </div>;
}