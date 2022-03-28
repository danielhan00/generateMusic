import React, { useState } from "react";
import { CounterTextField } from '../reusable/CounterTextField/CounterTextField';
import { DropdownMenu } from '../reusable/DropdownMenu/DropdownMenu';
import { TimeSignatureInput } from '../reusable/TimeSignatureInput/TimeSignatureInput';
import './TransportBar.css';

export const TransportBar = (props) => {
    return <div className="TransportBar">
        <table className="TransportTable">
            <tr>
                <td className="TransportField">
                    <text>Genre</text>
                    <DropdownMenu buttonName={props.genre} onClick={props.genreChangeClick} buttonOptions={['Pop','Rock', 'Jazz', 'Ragtime']}></DropdownMenu>
                </td>
                <td className="TransportField">
                    <text>Tempo</text>
                    <CounterTextField input={props.tempo}  min='50' max='300'></CounterTextField>    
                </td>
                <td className="TransportField">
                    <text>Time Signature</text>
                    <TimeSignatureInput input={props.timeSig}></TimeSignatureInput>
                </td>
                <td className="TransportField">
                    <text>Key</text>
                    <br></br>
                    <input input={props.key}></input>
                </td>
            </tr>
        </table>
    </div>
}
