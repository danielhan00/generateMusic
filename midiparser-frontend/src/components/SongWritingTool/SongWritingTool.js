import React, {useState, useEffect} from "react";
import { TransportBar } from "../TransportBar/TransportBar";
import { MidiInput } from "../MidiInput/MidiInput";
import { SuggestionBar } from "../SuggestionBar/SuggestionBar";
import { exportMidi } from "../../midiparser-backend/midiUtility";
import { saveAs } from 'file-saver'
import axios from "axios";
import Soundfont from 'soundfont-player'
import './SongWritingTool.css'

/**
 * SongWritingTool is one of the main components of the app. This
 * is the top level component for the Songwritng branch
 * 
 */
export const SongWritingTool =(props)=>{

    //transport data
    const [genre, setGenre] = useState('Pop');
    const [keyLetter, setKeyLetter] = useState('A');
    const [keyQuality, setKeyQuality] = useState('Major');
    const [genreMessage, setGenreMessage] = useState({
        data: {
            genreOptions: "Rock, Pop, Jazz"
        }
    })
    const [tempo, setTempo] = useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [timeSigDenom, setTimeSigDenom] = useState(4);

    //melody and chords
    const [melody, setMelody] = useState([]);
    const [chordNum, setChordNum] = useState(0);
    const [chords, setChords] = useState([]);
    const [chordNotes, setChordNotes] = useState([]);
    const [octaveChords, setOctaveChords] = useState([])
    const [updateChords, setUpdateChords] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [notesByMeasure, setNotesByMeasure] = useState([]);

      //sound controls
    const [isActive, setIsActive] = useState(false);
  const [chordSound, setChordSound] = useState('acoustic_grand_piano'); //accompaniment
  const [chordSoundName, setChordSoundName] = useState('Piano'); //accompanimentName


  //the api call to the markov chain to get recommended chords
    useEffect(() => {
        setLoading(true);
        axios.post('http://localhost:5000/flask/getchordssw',
            {
                "genre": genre,
                "key": keyLetter,
                "tonality": keyQuality,
                "numChords": chordNum,
                "melodyNotes": melody,
            }).then(response => {
                console.log("SUCCESS", response)
                if (response.data.resultStatus !== "FAILURE") {
                    setChords(response.data.chords)
                    setChordNotes(response.data.chordNotes)
                    setLoading(false);
                }
            }).catch(error => {
                console.log(error)
            })
    }, [updateChords])

    //the api call to get the genres
    useEffect(() => {
        axios.get('http://localhost:5000/flask/getchordssw').then(response => {
                console.log("SUCCESS", response)
                setGenreMessage(response)
            }).catch(error => {
                console.log(error)
            })

    }, []) 

    /**
     * to toggle the sound of a specific measure
     * @param {number} measure 
     */
    function toggle(measure) {
        var activeNow = !isActive
        setIsActive(activeNow)
        if (activeNow) {
            //individual play functions
            //playChord(chordNotes[measure]);
            //playMeasure(notesByMeasure[measure])
            playMidi(octaveChords[measure],notesByMeasure[measure])
        }
    }

/**
 * helper to set the instrument based on user input
 * @param {string} accom 
 */
    function changeAccompaniment(accom) {
        setChordSoundName(accom)
        if (accom === 'Piano') setChordSound('acoustic_grand_piano')
        else if (accom === 'Clavinet') setChordSound('clavinet')
        else if (accom === 'Guitar') setChordSound('electric_guitar_clean')
        else if (accom === 'Orchestra') setChordSound('string_ensemble_1')
        else if (accom === 'Synth') setChordSound('synth_brass_1')
        else if (accom === 'Vibraphone') setChordSound('vibraphone')
        else if (accom === 'None') setChordSound('none')
    }

    //to set the chords with their respective octave numbers
    useEffect(() => {
        let octaveChords = []
        for (let chord of chordNotes) {
            let numChord = []
            var rootNote = chord[0]
            for (let i = 0; i < chord.length; i++) {
                let note = findOctave(chord[i], rootNote, 3, i > 2)
                numChord.push(note);
            }
            octaveChords.push(numChord)
        }
        setOctaveChords(octaveChords);
    }, [chordNotes])

    /**
     * Saves the chord midi file to be downloaded
     */
    function exportChordMidi() {
        let blob = new Blob([exportMidi(octaveChords, tempo, [beatsPerMeasure, timeSigDenom])]) 
        let file = new File([blob], "downloaded_midi.mid");
        saveAs(file);
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


    /**
     * function to play the specified chord
     * @param {[]} notes 
     */
    // function for playing each chord
    function playChord(notes) {
        var ac = new AudioContext()
        console.log("in play chords")
        console.log(notes)
        Soundfont.instrument(ac, chordSound).then(function (instrument) {
            if (chordSound == 'none') {
                //do nothing
            }
            else {
                var rootNote = notes[0]
                
                for (let i = 0; i < notes.length; i++) {
                    instrument.play(findOctave(notes[i], rootNote, 4, i > 2), ac.currentTime, { duration: beatsPerMeasure * (60 / tempo) })
                }
            }
        })
        setIsActive(false);
    }

    /**
     * function to play the specified measure of notes
     * @param {[]} notes 
     */
    function playMeasure(notes) {
        var ac = new AudioContext()
        console.log("in play notes")
        console.log(notes)
        Soundfont.instrument(ac, chordSound).then(function (instrument) {
            if (chordSound == 'none') {
                //do nothing
        }
            else {
                    let note = []

                notes.forEach(element => { 
                    let newEl = { time: element.time - notes[0].time, note: element.midi, duration: element.duration }
                        note.push(newEl)
                    })
                    instrument.schedule(ac.currentTime ,note)
            }
        })
        setIsActive(false);
    }

    /**
     * functino to play both the chords and the melody of a measure in sync
     * @param {[]} chordNotes 
     * @param {[]} melNotes 
     */
    function playMidi(chordNotes, melNotes) {
        var ac = new AudioContext()
        console.log("in play chords")
        console.log(chordNotes)
        Soundfont.instrument(ac, chordSound).then(function (instrument) {
            if (chordSound == 'none') {
                //do nothing
        }
            else {
                //chords
                let note = []
                melNotes.forEach(element => {
                    note.push({ time: element.time - melNotes[0].time, note: element.midi, duration: element.duration })
                })

                //melody
                instrument.schedule(ac.currentTime ,note)
                    chordNotes.forEach(element => {
                        instrument.play(element, ac.currentTime, { duration: beatsPerMeasure * (60 / tempo) })
                    }) 
            }
        })
        setIsActive(false);
    }

    /**
     * funtion to upate the transport values
     */  
    function updateTransport() {
        setTempo(tempo);
        setBeatsPerMeasure(beatsPerMeasure);
        setTimeSigDenom(timeSigDenom);
    }
    
    //updates the transport
    useEffect(() => {
        updateTransport();
    }, [tempo.beatsPerMeasure, timeSigDenom]);

    
    return <div className="SWContainer">
        <MidiInput  tempo={tempo} setTempo={setTempo} timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom}
            melody={melody} setMelody={setMelody} chordNum={chordNum} setChordNum={setChordNum} updateChords={updateChords} setUpdateChords={setUpdateChords}
            chordNotes={chordNotes}  isLoading={isLoading} notesByMeasure={notesByMeasure} setNotesByMeasure={setNotesByMeasure} saveFile={exportChordMidi} findOctave={findOctave}
        ></MidiInput>
        <SuggestionBar togglePlay={toggle} measures={chordNum} chords={chords} setChords={setChords} isLoading={isLoading} />
       <TransportBar playing={isActive || isLoading} genre={genre} genreOptions={genreMessage.data.genreOptions} genreChangeClick={setGenre} accompaniment={chordSoundName} setAccompaniment={changeAccompaniment}
        keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
        timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom} changeChords={setUpdateChords} currChordProg={updateChords}></TransportBar>
    </div>;
}

