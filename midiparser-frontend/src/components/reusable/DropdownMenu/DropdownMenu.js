import React from "react";
import {DropdownButton, Dropdown } from 'react-bootstrap';
import './DropdownMenu.css';

export const DropdownMenu = (props) => {
    return <DropdownButton id="dropdown-basic-button" variant="secondary" title={props.buttonName}>
    {createButtonOptions(props.buttonOptions, props.onClick)}
  </DropdownButton>
}

function createButtonOptions(options, onClick) {
    let optionSet = []
    console.debug(options)
    options.forEach(element => {
        optionSet.push(<Dropdown.Item onClick={() => {onClick(element)}}>{element}</Dropdown.Item>)
    })
    
    return optionSet
}