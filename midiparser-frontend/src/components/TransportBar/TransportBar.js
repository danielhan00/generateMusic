import React, { useState } from "react";
import { CounterTextField } from '../reusable/CounterTextField/CounterTextField';
import { DropdownMenu } from '../reusable/DropdownMenu/DropdownMenu';
import { TimeSignatureInput } from '../reusable/TimeSignatureInput/TimeSignatureInput';
import { AButton } from '../reusable/AButton/AButton'
import './TransportBar.css';

/**
 * 
 * TransportBar is where all of the user input controls are
 */
export const TransportBar = (props) => {
    return <div className="TransportBar">
        <table className="TransportTable">
            <tr>
            <td className="InfoField">
                    <AButton playing={props.playing} onClick={props.changeChords} clickVar={props.currChordProg} buttonName="Change Chords"></AButton> 
                    <div className="SmallBarrier"/>
                    <text>Accompaniment</text>
                    <DropdownMenu playing={props.playing} buttonName={props.accompaniment} onClick={props.setAccompaniment} buttonOptions={['None', 'Piano', 'Clavinet', 'Guitar', 'Orchestra', 'Synth', 'Vibraphone']}></DropdownMenu> 
                </td>
                <td className="TransportField">
                    <text>Genre</text>
                    <DropdownMenu playing={props.playing} buttonName={props.genre} onClick={props.genreChangeClick} buttonOptions={props.genreOptions.split(',')}></DropdownMenu>
                </td>
                <td className="TransportField">
                    <text>Tempo</text>
                    <CounterTextField playing={true}input={props.tempo}  min='50' max='300'></CounterTextField>    
                </td>
                <td className="TransportField">
                    <text>Time Signature</text>
                    <TimeSignatureInput playing={true} setNumerator={props.setTimeSigNum} numerator={props.timeSigNum} setDenominator={props.setTimeSigDenom} denominator={props.timeSigDenom}
                    numMin={1} numMax={16} denMin={2} denMax={16}></TimeSignatureInput>
                </td>
                <td className="TransportField">
                    <text>Key</text>
                    <DropdownMenu playing={props.playing} buttonName={props.keyLetter} onClick={props.keyLetterClick} buttonOptions={['A', 'B', 'C', 'D', 'E', 'F', 'G']}></DropdownMenu>
                    <DropdownMenu playing={props.playing} buttonName={props.keyQuality} onClick={props.keyQualityClick} buttonOptions={['Major', 'Minor']}></DropdownMenu>
                </td>
                
            </tr>
        </table>
    </div>
}
