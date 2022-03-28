import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import './App.css';
import { LivePerformanceTool } from './components/LivePerformanceTool/LivePerformanceTool';
import { SongWritingTool } from './components/SongWritingTool/SongWritingTool';
import { Home } from './components/Home/Home';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <table className="NavBar">
              <tr>
              <td><Link className="NavText" to="/">Home</Link></td>
              <td><Link className="NavText" to="/songwriting">Songwriting Tool</Link></td>
              <td><Link className="NavText" to="/liveperformance">Live Performance Tool</Link></td>
              </tr>
          </table>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/liveperformance" element={<LivePerformanceTool chordName="Amaj"/>}>
          </Route>
          <Route path="/songwriting" element={<SongWritingTool/>}>
          </Route>
          <Route path="/" element={<Home/>}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
