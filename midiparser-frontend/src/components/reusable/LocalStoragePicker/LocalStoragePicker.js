import React, { useState } from 'react';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';



export const LocalStoragePicker = (props) => {
    const [file, setFile] = useState("Choose Midi File")

    const handleChange = (e) => {
        console.log("e = " + e);
        //setFile(e);
        props.currFileChange(e);
        props.f(localStorage.getItem(e));
    }
    return <div className='LocalStoragePicker'>
        <DropdownMenu buttonName={file} onClick={handleChange} buttonOptions={Object.keys(localStorage)}></DropdownMenu>
    </div>
 }
