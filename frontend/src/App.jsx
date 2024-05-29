import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Navbar from "./Navbar.js";
import ResponsesView from "./components/Responsesview.jsx";
import CreateResponse from "./components/CreateResponse.jsx";

function App() {
  return (
    <Router>
      <div>
        <Navbar/>
        <Routes>
          <Route path='/show_responses' element={<ResponsesView />}/>
          <Route path='/response' element={<CreateResponse />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;
