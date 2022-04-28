import React from "react";
import { Button } from 'react-bootstrap';

export const AButton = (props) => {
    function handleClick() {
        props.onClick(props.clickVar + 1);
    }

    return <div><Button disabled={props.playing} id="dropdown-basic-button" variant="secondary" onClick={handleClick}>{props.buttonName}</Button></div>
}

