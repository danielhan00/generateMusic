import React, {useState} from "react";
import { CounterTextField } from '../reusable/CounterTextField/CounterTextField';
import { DropdownMenu } from '../reusable/DropdownMenu/DropdownMenu';
import { TimeSignatureInput } from '../reusable/TimeSignatureInput/TimeSignatureInput';
import './LiveInfoBar.css';

export const LiveInfoBar =(props)=>{
    return <div><div className="InfoBar">
        <table className="InfoTable">
            <tr>
                <td className="InfoField">
                    <text>Genre</text>
                    <DropdownMenu buttonName={props.genre} onClick={props.genreChangeClick} buttonOptions={['Rock', 'Jazz', 'Ragtime']}></DropdownMenu>
                </td>
                <td className="InfoField">
                    <text>Tempo</text>
                    <CounterTextField input={props.tempo}  min='50' max='300'></CounterTextField>
                </td>
                <td className="InfoField">
                    <text>Time Signature</text>
                    <TimeSignatureInput input={props.timeSig}></TimeSignatureInput>
                </td>
                <td className="InfoField">
                    <text>Key</text>
                    <DropdownMenu buttonName={props.keyLetter} onClick={props.keyLetterClick} buttonOptions={['A', 'B', 'C', 'D', 'E', 'F', 'G']}></DropdownMenu>
                    <DropdownMenu buttonName={props.keyQuality} onClick={props.keyQualityClick} buttonOptions={['Major', 'Minor']}></DropdownMenu>
                </td>
                <td className="InfoField">
                <text>Randomness</text>
                    <CounterTextField input={props.tempo}  min='0' max='10'></CounterTextField>
                </td>
            </tr>
        </table>
        
    </div>
    <div className="MeasureBar">
        {/* WILL ADD THE METRONOME TEXT LATER*/}
    </div>
    </div>;
}