import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { LineScalePulseOut } from 'react-pure-loaders';
import './SuggestionBar.css'

/**
 * SuggestionBar is where the results of the markov chain go
 */
export const SuggestionBar = (props) => {
    const [suggestions, setSuggestions] = useState([]);
   
    //gets the size of each measure
    let measureWidth = 1494/ props.measures;
    const pianoWidth = 126;
    
    //sets the suggestions by measure
    useEffect(() => {
        const suggestions = []
        for (let measure = 0; measure < props.measures; measure++){
            suggestions.push(
                <div className="Suggestion"  key={measure} style={{width:measureWidth}} >
                    <text>Chord</text>
                    <br></br>
                    {props.isLoading? <LineScalePulseOut color={'#fff'} loading={props.isLoading}/> :<Button className='upload-btn' variant="secondary" onClick={() =>props.togglePlay(measure)}>{props.chords[measure]}</Button>}
                </div>)
        }
        setSuggestions(suggestions);
    }, [props])
    
    return <><div className="SuggestionBar">     
        {suggestions}
    </div>
    </>
}