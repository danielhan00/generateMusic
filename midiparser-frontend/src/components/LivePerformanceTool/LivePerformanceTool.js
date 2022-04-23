import React, { useState, useEffect } from "react";
import { LiveInfoBar } from '../LiveInfoBar/LiveInfoBar';
import { ChordDisplay } from '../ChordDisplay/ChordDisplay';
import './LivePerformanceTool.css'
import axios from 'axios'

export const LivePerformanceTool = (props) => {
    // includes starter chord sequence
    const [chordMessage, setChordMessage] = useState({
        data: {
            chords: ["Amin", "C", "F", "E7"]
        }
    })

    const [genreMessage, setGenreMessage] = useState({
        data: {
            genreOptions: "Rock, Pop, Jazz"
        }
    })

    const [genre, setGenre] = useState('Pop')
    const [keyLetter, setKeyLetter] = useState('A');
    const [keyQuality, setKeyQuality] = useState('Major');
    // chord length is measured in beats
    const [chordLength, setChordLength] = useState(4);
    const [currChordBeats, setCurrChordBeats] = useState(0);
    const [numChords, setNumChords] = useState(4);
    const [currChord, setCurrChord] = useState((chordMessage.data.chords)[0]);
    const [currChordNum, setCurrChordNum] = useState(0);
    const [nextChord, setNextChord] = useState((chordMessage.data.chords)[1]);

    const [tempo, setTempo] = useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [timeSigDenom, setTimeSigDenom] = useState(4);
    const [currentBeat, setCurrentBeat] = useState(1);

    // controls whether the tool is playing/counting
    const [isActive, setIsActive] = useState(false);

    const [changeChords, setChangeChords] = useState(0);

    useEffect(() => {
        axios.post('http://localhost:5000/flask/getchords',
            {
                "genre": genre,
                "key": keyLetter,
                "tonality": keyQuality,
                "numChords": numChords
            }).then(response => {
                console.log("SUCCESS", response)
                setChordMessage(response)
                setCurrChord((chordMessage.data.chords)[0])
                setNextChord((chordMessage.data.chords)[1])
            }).catch(error => {
                console.log(error)
            })

    }, [changeChords])

    useEffect(() => {
        axios.get('http://localhost:5000/flask/getchords').then(response => {
                console.log("SUCCESS", response)
                setGenreMessage(response)
            }).catch(error => {
                console.log(error)
            })

    }, [])

    function toggle() {
        setIsActive(!isActive);
    }

    function reset() {
        setCurrentBeat(1);
        setIsActive(false);
        setCurrChordBeats(0);
        setCurrChordNum(0);
    }

    // tracks time to update the current beat and chords
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setCurrentBeat(currentBeat => (currentBeat % beatsPerMeasure + 1));
            }, 1000 * 60 / tempo);
        } else if (!isActive && currentBeat !== 1) {
            clearInterval(interval);
            reset();
        }
        return () => clearInterval(interval);
    }, [isActive, currentBeat]);

    // tracks the state change of the current beat to iterate the current chord
    useEffect(() => {
        if (isActive) {
            if (currChordBeats >= chordLength - 1) {
                setCurrChordBeats(0);
                setCurrChordNum((currChordNum + 1) % numChords);
                if (chordMessage.data.chords != undefined && chordMessage.data.chords != null) {
                    setCurrChord((chordMessage.data.chords)[(currChordNum + 1)% numChords]);
                    setNextChord((chordMessage.data.chords)[(currChordNum + 2) % numChords]);
                }
            }
            else setCurrChordBeats(currChordBeats + 1);
        }
    }, [currentBeat])

    // tracks the state change of the current chord num to iterate the current chord labels
    useEffect(() => {
        if (chordMessage.data.chords != undefined && chordMessage.data.chords != null) {
            setCurrChord((chordMessage.data.chords)[(currChordNum)]);
            setNextChord((chordMessage.data.chords)[(currChordNum + 1) % numChords]);
        }
    }, [currChordNum])

    return <div className="LiveContainer">
        <ChordDisplay chordName={currChord} nextChordName={nextChord}></ChordDisplay>
        <p>{chordMessage.data.chords}</p>
        <LiveInfoBar playing={isActive} togglePlay={toggle} currentBeat={currentBeat} genre={genre} genreOptions={genreMessage.data.genreOptions} genreChangeClick={setGenre}
            keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
            timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom} 
            numChords={numChords} setNumChords={setNumChords} chordLength={chordLength} setChordLength={setChordLength} changeChords={setChangeChords} currChordProg={changeChords}></LiveInfoBar>
    </div>;
}
