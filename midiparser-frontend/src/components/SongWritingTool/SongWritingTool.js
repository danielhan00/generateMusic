import React, {useState, useEffect} from "react";
import { TransportBar } from "../TransportBar/TransportBar";
import { MidiInput } from "../MidiInput/MidiInput";
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

    useEffect(() => {
        axios.get('http://localhost:5000/flask/getchords').then(response => {
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
            melody={melody} setMelody={setMelody} chordNum={chordNum} setChordNum={setChordNum}
        ></MidiInput>
       <TransportBar genre={genre} genreOptions={genreMessage.data.genreOptions} genreChangeClick={setGenre} 
        keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={tempo} setTempo={setTempo}
        timeSigNum={beatsPerMeasure} setTimeSigNum={setBeatsPerMeasure} setTimeSigDenom={setTimeSigDenom} timeSigDenom={timeSigDenom}></TransportBar>
    </div>;
}

