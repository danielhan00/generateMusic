import React from "react";
import './TimeSignatureInput.css';

export const TimeSignatureInput =(props)=>{
    return <div>
        <input type="number" className="TimeSigNum" value={props.numerator} min={props.numMin} max={props.denMax}/>
        <p className="TimeSigDivider">____</p>
        <input type="number" className="TimeSigNum" value={props.denominator} min={props.denMin} max={props.denMax}/>
    </div>;
}