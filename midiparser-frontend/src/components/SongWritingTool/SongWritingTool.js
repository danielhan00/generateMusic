import React, {useState, useEffect} from "react";
import { TransportBar } from "../TransportBar/TransportBar";
import { MidiInput } from "../MidiInput/MidiInput";
import { SuggestionBar } from "../SuggestionBar/SuggestionBar";
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
            playMidi(chordNotes[measure],notesByMeasure[measure])
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


    /**
     * function to play the specified chord
     * @param {[]} notes 
     */
    function playChord(notes) {
        var ac = new AudioContext()
        console.log("in play chords")
        console.log(notes)
        Soundfont.instrument(ac, chordSound).then(function (instrument) {
            if (chordSound == 'none') {
                //do nothing
        }
            else {
                    notes.forEach(element => {
                        instrument.play(element + '4', ac.currentTime, { duration: beatsPerMeasure * (60 / tempo) })
                    }) 
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
                        instrument.play(element + '4', ac.currentTime, { duration: beatsPerMeasure * (60 / tempo) })
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
            chordNotes={chordNotes}  isLoading={isLoading} notesByMeasure={notesByMeasure} setNotesByMeasure={setNotesByMeasure}
        ></MidiInput>
        <SuggestionBar togglePlay={toggle} measures={chordNum} chords={chords} setChords={setChords} isLoading={isLoading} />
       <TransportBar playing={isActive || isLoading} genre={genre} genreOptions={genreMessage.data.genreOptions} genreChangeClick={setGenre} accompaniment={chordSoundName} setAccompaniment={changeAccompaniment}
        keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
        timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom} changeChords={setUpdateChords} currChordProg={updateChords}></TransportBar>
    </div>;
}

