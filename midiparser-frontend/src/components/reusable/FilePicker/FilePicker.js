import React from 'react';


export const FilePicker = (props) => {
    let fileReader;
    let fileName; 
        
        const handleFileRead = (e) => {
            const content = fileReader.result;
          console.log(content)
          // … do something with the 'content' …
            props.f(content)
            localStorage.setItem(fileName, content);
            
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
            id='file'
            className='input-file'
            accept='.mid'
            onChange={e => handleFileChosen(e.target.files[0])}
          />
        </div>;

}