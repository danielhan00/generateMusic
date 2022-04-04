import React, { useState, useEffect } from "react";
import { LiveInfoBar } from '../LiveInfoBar/LiveInfoBar';
import { ChordDisplay } from '../ChordDisplay/ChordDisplay';
import './LivePerformanceTool.css'

export const LivePerformanceTool = (props) => {
    const [genre, setGenre] = useState('Placeholder')
    const [keyLetter, setKeyLetter] = useState('A');
    const [keyQuality, setKeyQuality] = useState('Major');
    const [chordLength, setChordLength] = useState(1);
    const [tempo, setTempo] = useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [timeSigDenom, setTimeSigDenom] = useState(4);
    const [currentBeat, setCurrentBeat] = useState(1);

    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    function toggle() {
        setIsActive(!isActive);
    }

    function reset() {
        setCurrentBeat(1);
        setIsActive(false);
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setCurrentBeat(currentBeat => (currentBeat%beatsPerMeasure + 1));
            }, 1000 * 60/tempo);
        } else if (!isActive && currentBeat !== 1) {
            clearInterval(interval);
            reset()
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    return <div className="LiveContainer">
        <ChordDisplay className="ChordContainer" chordName={props.chordName} nextChordName={tempo}></ChordDisplay>
        <LiveInfoBar playing={isActive} togglePlay={toggle} currentBeat={currentBeat} genre={genre} genreChangeClick={setGenre} 
        keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
        timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom} randomness={props.randomness}></LiveInfoBar>
    </div>;
}