import React, {useState, useEffect} from "react";
import { TransportBar } from "../TransportBar/TransportBar";
import { MidiInput } from "../MidiInput/MidiInput";
import { SuggestionBar } from "../SuggestionBar/SuggestionBar";
import axios from "axios";
import './SongWritingTool.css'


export const SongWritingTool =(props)=>{

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
    const [melody, setMelody] = useState([]);
    const [chordNum, setChordNum] = useState(0);
    const [chords, setChords] = useState([]);
    const [updateChords, setUpdateChords] = useState(0);
    const [isLoading, setLoading] = useState(true);


    
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
                setChords(response.data.chords)
                setLoading(false);
            }).catch(error => {
                console.log(error)
            })

    }, [updateChords])

    useEffect(() => {
        axios.get('http://localhost:5000/flask/getchordssw').then(response => {
                console.log("SUCCESS", response)
                setGenreMessage(response)
            }).catch(error => {
                console.log(error)
            })

    }, []) 


    function updateTransport() {
        setTempo(tempo);
        setBeatsPerMeasure(beatsPerMeasure);
        setTimeSigDenom(timeSigDenom);
    }
    
    useEffect(() => {
        updateTransport();
    }, [tempo.beatsPerMeasure, timeSigDenom]);

    
    return <div className="Container">
        <MidiInput tempo={tempo} setTempo={setTempo}
            timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom}
            melody={melody} setMelody={setMelody} chordNum={chordNum} setChordNum={setChordNum} updateChords={updateChords} setUpdateChords={setUpdateChords}
        ></MidiInput>
        <SuggestionBar measures={chordNum} chords={chords} setChords={setChords} isLoading={isLoading} />
       <TransportBar genre={genre} genreOptions={genreMessage.data.genreOptions} genreChangeClick={setGenre} 
        keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
        timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom} changeChords={setUpdateChords} currChordProg={updateChords}></TransportBar>
    </div>;
}

