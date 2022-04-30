import React, { useEffect, useState } from "react"
import './Home.css'
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom"
import axios from 'axios'
import songwritingsnap from './songwritingsnap.png'
import liveperformancesnap from './liveperformancesnap.png'

export const Home = (props) => {
    const [getMessage, setGetMessage] = useState({})

    useEffect(() => {
        axios.get('http://localhost:5000/flask/hello').then(response => {
            console.log("SUCCESS", response)
            setGetMessage(response)
        }).catch(error => {
            console.log(error)
        })

    }, [])


    return <div className="HomeContainer">
        <table className="ContentTable">
            <tr>
                <td>
                    <div className="ContentBox">
                        <Link className="ContentText" to="/songwriting">Songwriting Tool</Link>
                        <img className ="HomeImage" src={songwritingsnap} alt="Songwriting Tool"/>
                    </div>
                </td>
                <td>
                    <div className="Divider"></div>
                </td>
                <td>
                    <div className="ContentBox">
                        <Link className="ContentText" to="/liveperformance">Live Performance Tool</Link>
                        <img className ="HomeImage" src={liveperformancesnap} alt="Live Performance Tool"/>
                    </div>
                </td>
            </tr>
        </table>
    </div>
        ;
}