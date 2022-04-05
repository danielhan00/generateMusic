import React, { useEffect, useState } from "react";
import './Home.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import { LivePerformanceTool } from "../LivePerformanceTool/LivePerformanceTool";
import { SongWritingTool } from "../SongWritingTool/SongWritingTool";
import axios from 'axios'

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
                        <image></image>
                    </div>
                </td>
                <td>
                    <div className="Divider"></div>
                </td>
                <td>
                    <div className="ContentBox">
                        <Link className="ContentText" to="/liveperformance">Live Performance Tool</Link>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                <div>{getMessage.status === 200 ? 
          <h3>{getMessage.data.message}</h3>
          :
          <h3>LOADING</h3>}</div>
                </td>
            </tr>
        </table>
    </div>
        ;
}