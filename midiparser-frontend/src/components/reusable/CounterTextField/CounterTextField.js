import React, {useState} from "react";
import classes from './CounterTextField.css';

export const CounterTextField =(props)=>{
    return <div>
        <input type="number" value={props.input} min={props.min} max={props.max}/>
    </div>;
}