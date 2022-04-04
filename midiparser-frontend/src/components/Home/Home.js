import React from "react";
import './Home.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import { LivePerformanceTool } from "../LivePerformanceTool/LivePerformanceTool";
import { SongWritingTool } from "../SongWritingTool/SongWritingTool";

export const Home =(props)=>{
    
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
        </table>
    </div>
    ;
}