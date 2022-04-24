import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { loadMidi } from '../../../midiparser-backend';




export const FilePicker = (props) => {
  let fileReader;
  let fileReader64;
  let fileName; 
  let base64;
  const fileInput = useRef(null);
 
 
        
        const handleFileRead = (e) => {
          const content = fileReader.result;

          console.log(content)
          // … do something with the 'content' …
          props.f(content)
          localStorage.setItem(fileName, content, base64);
          props.currFileChange(fileName);
          


            
  };
  
  const handle64Read = (e) => {
    base64 = fileReader64.result;
    props.midiChange(base64);
  }
        
        const handleFileChosen = (file) => {
          fileReader = new FileReader();
          fileReader64 = new FileReader();

          fileReader64.onloadend = handle64Read;
          fileReader.onloadend = handleFileRead;
          
          fileName = file.name.substring(0, file.name.length - 4);
          fileReader64.readAsDataURL(file);
          fileReader.readAsBinaryString(file);
          
          
          
        };
        
  return <div className='upload-expense'>
          <input
            type='file'
            id="file-picker"
            className='input-file'
      accept='.mid'
      ref={fileInput}
      onChange={e => handleFileChosen(e.target.files[0])}
      style={{ display: 'none'}}
    />
    
    <Button className='upload-btn' variant="secondary" onClick={ () => fileInput.current.click()}>Upload New Midi</Button>
        </div>;

}

function getBase64(file) {
  var reader = new FileReader();
  let final;
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
    final = reader.result;
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };

  reader.onloadend = () => {
    final =  reader.result;
  }

  return final;
}