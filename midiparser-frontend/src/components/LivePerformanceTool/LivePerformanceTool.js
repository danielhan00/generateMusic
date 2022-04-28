import React, { useState, useEffect } from "react";
import { LiveInfoBar } from '../LiveInfoBar/LiveInfoBar';
import { ChordDisplay } from '../ChordDisplay/ChordDisplay';
import './LivePerformanceTool.css'
import axios from 'axios'
import Soundfont from 'soundfont-player'
import metAudio from './metronome.wav'

export const LivePerformanceTool = (props) => {
    // includes starter chord sequence
    const [chordMessage, setChordMessage] = useState({
        data: {
            chords: ["Amin", "C", "F", "E7"],
            chordNotes: [["A", "C", "E"], ["C", "E", "G"], ["F", "A", "C"], ["E", "G#", "B", "D"]]
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

    // variables for tempo and counting related actions
    const [tempo, setTempo] = useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [timeSigDenom, setTimeSigDenom] = useState(4);
    const [currentBeat, setCurrentBeat] = useState(1);

    // controls whether the tool is playing/counting
    const [isActive, setIsActive] = useState(false);

    // integer for counting how many progressions are generated
    const [changeChords, setChangeChords] = useState(0);

    // accompaniment style for sound playback
    const [accompaniment, setAccompaniment] = useState('acoustic_grand_piano');
    const [accompanimentName, setAccompanimentName] = useState('Piano');
    const metronomeSound = new Audio(metAudio);

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
                setCurrChord((response.data.chords)[0])
                setNextChord((response.data.chords)[1])
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
        var activeNow = !isActive
        setIsActive(activeNow)
        if (activeNow) {
            if (accompaniment == 'metronome') metronomeSound.play();
            else playChord(chordMessage.data.chordNotes[0])
        }
    }

    function reset() {
        setCurrentBeat(1);
        setIsActive(false);
        setCurrChordBeats(0);
        setCurrChordNum(0);
    }

    function changeAccompaniment(accom) {
        setAccompanimentName(accom)
        if (accom === 'Piano') setAccompaniment('acoustic_grand_piano')
        else if (accom === 'Clavinet') setAccompaniment('clavinet')
        else if (accom === 'Guitar') setAccompaniment('electric_guitar_clean')
        else if (accom === 'Orchestra') setAccompaniment('string_ensemble_1')
        else if (accom === 'Synth') setAccompaniment('synth_brass_1')
        else if (accom === 'Vibraphone') setAccompaniment('vibraphone')
        else if (accom === 'Metronome') setAccompaniment('metronome')
        else if (accom === 'None') setAccompaniment('none')
    }

    function playChord(notes) {
        var ac = new AudioContext()
        console.log("in play chords")
        console.log(notes)
        Soundfont.instrument(ac, accompaniment).then(function (instrument) {
            if (accompaniment == 'none' || accompaniment == 'metronome') {
                //do nothing
            }
            else {
                notes.forEach(element =>
                {
                    instrument.play(element + '4', ac.currentTime, { duration: chordLength * (60/tempo)})
                })
            }
          })
    }

    // tracks time to update the current beat and chords
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setCurrentBeat(currentBeat => (currentBeat % beatsPerMeasure + 1));
                if (accompaniment == 'metronome') metronomeSound.play();
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
                    playChord((chordMessage.data.chordNotes)[(currChordNum + 1)% numChords]);
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
        <ChordDisplay chordName={currChord} nextChordName={nextChord} progression={chordMessage.data.chords}></ChordDisplay>
        <LiveInfoBar playing={isActive} togglePlay={toggle} currentBeat={currentBeat} accompaniment={accompanimentName} setAccompaniment={changeAccompaniment}
            genre={genre} genreOptions={genreMessage.data.genreOptions} genreChangeClick={setGenre}
            keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
            timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom} 
            numChords={numChords} setNumChords={setNumChords} chordLength={chordLength} setChordLength={setChordLength} changeChords={setChangeChords} currChordProg={changeChords}></LiveInfoBar>
    </div>;
}
