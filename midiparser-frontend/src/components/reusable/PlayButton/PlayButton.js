import React from 'react'
import './PlayButton.css'

export const PlayButton = (props) => {
    return (
      <div className="player" >
        {props.playing? <Pause onPlayerClick={props.togglePlay} /> : <Play onPlayerClick={props.togglePlay} />}
      </div>
    )
  }

const Play = ({onPlayerClick}) => {
    return (
        <button id="playButton" onClick={onPlayerClick}></button>
    )
  }
  
  const Pause = ({onPlayerClick}) => {
    return (
      <button id="pauseButton" onClick={onPlayerClick}></button>
    )
  }