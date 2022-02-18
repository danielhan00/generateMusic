import React, {useState} from "react";
import './ChordDisplay.css';

export const ChordDisplay =(props)=>{
    return <div className="ChordContainer">
        <div className="ChordText">
            <text>{props.chordName}</text>
            </div>   
        </div>;
}