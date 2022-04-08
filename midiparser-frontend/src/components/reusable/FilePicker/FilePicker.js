import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';


export const FilePicker = (props) => {
    let fileReader;
  let fileName; 
  const fileInput = useRef(null);
        
        const handleFileRead = (e) => {
            const content = fileReader.result;
          console.log(content)
          // … do something with the 'content' …
          props.f(content)
          localStorage.setItem(fileName, content);
          props.currFileChange(fileName);
            
        };
        
        const handleFileChosen = (file) => {
          fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            fileName = file.name.substring(0, file.name.length - 4);
            
            //fileReader.readAsText(file);
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