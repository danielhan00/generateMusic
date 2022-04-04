import React from "react";
import './TimeSignatureInput.css';

export const TimeSignatureInput =(props)=>{
    const onNumeratorChange = (event) => {
        
        props.setNumerator(event.target.value)
    }

    const onDenominatorChange = (event) => {
        if (event.target.value > props.denominator && props.denominator < props.denMax) props.setDenominator(props.denominator * 2)
        else if (event.target.value < props.denominator && props.denominator > props.denMin) props.setDenominator(props.denominator/2)
    }

    return <div>
        <input type="number" className="TimeSigNum" maxlength="2" disabled={props.playing} onChangeCapture={onNumeratorChange} defaultValue={props.numerator} min={props.numMin} max={props.numMax}/>
        <hr class="rounded" className="TimeSigDivider"/>
        <input type="number" className="TimeSigNum" maxlength="2" disabled={props.playing} onClick="return false" onChangeCapture={onDenominatorChange} value={props.denominator} min={props.denMin} max={props.denMax} step="2"/>
    </div>;
}