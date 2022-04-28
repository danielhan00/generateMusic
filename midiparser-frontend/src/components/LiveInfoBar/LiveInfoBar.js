import React, { useState } from "react";
import { CounterTextField } from '../reusable/CounterTextField/CounterTextField';
import { DropdownMenu } from '../reusable/DropdownMenu/DropdownMenu';
import { TimeSignatureInput } from '../reusable/TimeSignatureInput/TimeSignatureInput';
import { PlayButton } from '../reusable/PlayButton/PlayButton';
import { AButton } from '../reusable/AButton/AButton'
import './LiveInfoBar.css';

export const LiveInfoBar = (props) => {
    return <div className="LiveBottomContainer"><div className="InfoBar">
        <table className="InfoTable">
            <tr>
                <td className="InfoField">
                    <PlayButton playing={props.playing} togglePlay={props.togglePlay}></PlayButton>
                </td>
                <td className="InfoField">
                    <text>Genre</text>
                    <DropdownMenu playing={props.playing} buttonName={props.genre} onClick={props.genreChangeClick} buttonOptions={props.genreOptions.split(',')}></DropdownMenu>
                </td>
                <td className="InfoField">
                    <text>Tempo</text>
                    <CounterTextField playing={props.playing} onChange={props.setTempo} input={props.tempo} min='50' max='300'></CounterTextField>
                </td>
                <td className="InfoField">
                    <text>Time Signature</text>
                    <TimeSignatureInput playing={props.playing} setNumerator={props.setTimeSigNum} numerator={props.timeSigNum} setDenominator={props.setTimeSigDenom} denominator={props.timeSigDenom}
                    numMin={1} numMax={16} denMin={2} denMax={16}></TimeSignatureInput>
                </td>
                <td className="InfoField">
                    <text>Key</text>
                    <DropdownMenu playing={props.playing} buttonName={props.keyLetter} onClick={props.keyLetterClick} buttonOptions={['Ab', 'A', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G']}></DropdownMenu>
                    <DropdownMenu playing={props.playing} buttonName={props.keyQuality} onClick={props.keyQualityClick} buttonOptions={['Major', 'Minor']}></DropdownMenu>
                </td>
                <td className="InfoField">
                    <text>Number of Chords</text>
                    <CounterTextField playing={props.playing} onChange={props.setNumChords} input={props.numChords} min='0' max='10'></CounterTextField>
                    <p></p>
                    <text>Beats per Chord</text>
                    <CounterTextField playing={props.playing} onChange={props.setChordLength} input={props.chordLength} min='1' max='128'></CounterTextField>
                </td>
                <td className="InfoField">
                    <AButton playing={props.playing} onClick={props.changeChords} clickVar={props.currChordProg} buttonName="Change Chords"></AButton>
                    <div className="SmallBarrier"/>
                    <text>Accompaniment</text>
                    <DropdownMenu playing={props.playing} buttonName={props.accompaniment} onClick={props.setAccompaniment} buttonOptions={['None', 'Piano', 'Clavinet', 'Guitar', 'Orchestra', 'Synth', 'Vibraphone', 'Metronome']}></DropdownMenu> 
                </td>
            </tr>
        </table>

    </div>
        <div className="MeasureBar">
            <text className="MeasureText">{props.currentBeat}/{props.timeSigNum}</text>
        </div>
    </div>;
}