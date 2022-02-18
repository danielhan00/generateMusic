import React from "react";
import {DropdownButton, Dropdown } from 'react-bootstrap';
import './DropdownMenu.css';

export const DropdownMenu = (props) => {
    return <DropdownButton id="dropdown-basic-button" variant="secondary" title={props.buttonName}>
    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
  </DropdownButton>
}