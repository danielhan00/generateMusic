import React, { useState } from 'react';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';


/**
 * LocalStoragePicker handles an incoming file from local storage. Through props.f, you 
 * can handle the result however you want
  
 */
export const LocalStoragePicker = (props) => {
    const [file, setFile] = useState("Choose Midi File")

    const handleChange = (e) => {
      
        //changes the current file and gets the files content 
        props.currFileChange(e);
        props.f(localStorage.getItem(e));
    }
    return <div className='LocalStoragePicker'>
        <DropdownMenu buttonName={file} onClick={handleChange} buttonOptions={Object.keys(localStorage)}></DropdownMenu>
    </div>
 }
