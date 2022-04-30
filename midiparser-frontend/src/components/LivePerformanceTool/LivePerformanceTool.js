import React, { useState, useEffect } from "react";
import { LiveInfoBar } from '../LiveInfoBar/LiveInfoBar';
import { ChordDisplay } from '../ChordDisplay/ChordDisplay';
import './LivePerformanceTool.css'
import axios from 'axios'
import Soundfont from 'soundfont-player'
import metAudio from './metronome.wav'

export const LivePerformanceTool = (props) => {
    // API States: includes starter data
    // API State for getting chords and chord notes
    const [chordMessage, setChordMessage] = useState({
        data: {
            chords: ["Amin", "C", "F", "E7"],
            chordNotes: [["A", "C", "E"], ["C", "E", "G"], ["F", "A", "C"], ["E", "G#", "B", "D"]]
        }
    })
    // API State for getting genres
    const [genreMessage, setGenreMessage] = useState({
        data: {
            genreOptions: "Rock, Pop, Jazz"
        }
    })

    // whether the API is loading
    const [isLoading, setLoading] = useState(true);

    // genre and key information
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
    const [accompaniment, setAccompaniment] = useState('none');
    const [accompanimentName, setAccompanimentName] = useState('None');
    const metronomeSound = new Audio(metAudio);

    useEffect(() => {
        setLoading(true);
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
                setLoading(false);
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
            else if (accompaniment !== 'none') playChord(chordMessage.data.chordNotes[0])
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

    // constant for finding octave relation of notes
    const noteMap = new Map();
    noteMap.set('C', 0)
    noteMap.set('C#', 1)
    noteMap.set('Db', 1)
    noteMap.set('D', 2)
    noteMap.set('D#', 3)
    noteMap.set('Eb', 3)
    noteMap.set('E', 4)
    noteMap.set('F', 5)
    noteMap.set('F#', 6)
    noteMap.set('Gb', 6)
    noteMap.set('G', 7)
    noteMap.set('G#', 8)
    noteMap.set('Ab', 8)
    noteMap.set('A', 9)
    noteMap.set('A#', 10)
    noteMap.set('Bb', 10)
    noteMap.set('B', 11)

    // helper function for deciding octaves of each note
    // handles notes above the fifth differently for spreading out extensions above 7
    function findOctave(noteName, rootName, currOctave, aboveFifth) {
        let finalNum = currOctave;
        if (noteMap.get(noteName) < noteMap.get(rootName)) {
            finalNum += 1;
        }
        // checks if above the fifth of the chord and the interval is less than a minor 6th
        if (aboveFifth && ((noteMap.get(noteName) - noteMap.get(rootName)) < 8 || (noteMap.get(noteName) - noteMap.get(rootName)) < -3)) {
            finalNum += 1;
        }
        return noteName +'' + finalNum
    }

    // function for playing each chord
    function playChord(notes) {
        var ac = new AudioContext()
        console.log("in play chords")
        console.log(notes)
        Soundfont.instrument(ac, accompaniment).then(function (instrument) {
            if (accompaniment == 'none' || accompaniment == 'metronome') {
                //do nothing
            }
            else {
                var rootNote = notes[0]
                
                for (let i = 0; i < notes.length; i++) {
                    instrument.play(findOctave(notes[i], rootNote, 3, i > 2), ac.currentTime, { duration: chordLength * (60/tempo)})
                }
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
        <ChordDisplay chordName={currChord} nextChordName={nextChord} progression={chordMessage.data.chords} isLoading={isLoading}></ChordDisplay>
        <LiveInfoBar playing={isActive} togglePlay={toggle} currentBeat={currentBeat} accompaniment={accompanimentName} setAccompaniment={changeAccompaniment}
            genre={genre} genreOptions={genreMessage.data.genreOptions} genreChangeClick={setGenre}
            keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
            timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom} 
            numChords={numChords} setNumChords={setNumChords} chordLength={chordLength} setChordLength={setChordLength} changeChords={setChangeChords} currChordProg={changeChords}></LiveInfoBar>
    </div>;
}
