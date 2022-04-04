import React, {useState} from "react";
import classes from './CounterTextField.css';

export const CounterTextField =(props)=>{
    const handleChange = (event) => {
        //if (event.target.value < props.min) props.onChange(props.min);
        //else if (event.target.value > props.max) props.onChange(props.max);
        props.onChange(event.target.value);
    }
    
    return <div>
        <input type="number" disabled={props.playing} onChange={handleChange} value={props.input} min={props.min} max={props.max}/>
    </div>;
}