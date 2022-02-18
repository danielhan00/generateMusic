import React, {useState} from "react";
import { CounterTextField } from '../reusable/CounterTextField/CounterTextField';
import { DropdownMenu } from '../reusable/DropdownMenu/DropdownMenu';
import { TimeSignatureInput } from '../reusable/TimeSignatureInput/TimeSignatureInput';
import './LiveInfoBar.css';

export const LiveInfoBar =(props)=>{
    return <div className="InfoBar">
        <table>
            <tr>
                <td className="InfoField">
                    <text>Genre</text>
                    <DropdownMenu buttonName={props.genre}></DropdownMenu>
                </td>
                <td className="InfoField">
                    <text>Tempo</text>
                    <CounterTextField input={props.tempo}  min='50' max='300'></CounterTextField>
                </td>
                <td className="InfoField">
                    <text>Time Signature</text>
                    <TimeSignatureInput input={props.tempo}></TimeSignatureInput>
                </td>
                <td className="InfoField">
                    <text>Time Signature</text>
                    <CounterTextField input={props.tempo}></CounterTextField>
                </td>
            </tr>
        </table>
        
    </div>;
}