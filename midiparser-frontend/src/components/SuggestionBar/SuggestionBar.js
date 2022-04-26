import { left } from "@popperjs/core";
import React, { useEffect, useState } from "react";
import { DropdownMenu } from '../reusable/DropdownMenu/DropdownMenu';
import './SuggestionBar.css'

export const SuggestionBar = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    // const [choice, setChoice] = useState(["C", "D", "E", "F", "G", "A", "B", "C", "D"])
    const [update, setUpdate] = useState(false);
    
    /*
    const updateChoices = (event,index) => {
        const newChoices = choice;
        console.log(event)
        newChoices[index] = event;
        console.log(newChoices);
    
        setChoice(newChoices); 
        console.log(choice)
        setUpdate(true);
    }
*/
    let measureWidth = 1474/ props.measures;
    const pianoWidth = 126;
    
    
   
    
    useEffect(() => {
        const suggestions = []
        console.log(props.measures);
        for (let measure = 0; measure < props.measures; measure++){
            let position = pianoWidth + (measure * measureWidth);
            suggestions.push(
                <div className="Suggestion"  key={measure} style={{width:measureWidth}} >
                    <text>Chord</text>
                    <DropdownMenu  buttonName={props.chords[measure]} /*onClick={(e) => updateChoices(e, measure)}*/ buttonOptions={["C", "Dm", "Em", "F", "G", "Am" , "Bdim"]}></DropdownMenu>
                </div>)
        }
        //document.getElementsByClassName("Suggestion").
        console.log(suggestions);
        if(update){setUpdate(false)}
        setSuggestions(suggestions);
    }, [props,update])
    
    return <><div className="SuggestionBar">
                    {suggestions}
    </div>
    </>
}