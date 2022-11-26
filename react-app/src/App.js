import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router,Routes,Route, Link} from 'react-router-dom';
import FilterPage from './FilterPage'
import RestorationPage from './RestorationPage'
import NavigationBar from './NavBar'
function App() {

  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col">
        {/* Header */}
        <div className="w-full h-20 bg-blue-900 text-white flex items-center">
          <p className="text-4xl mx-[15px] font-semibold">Self-tuning Image Restoration</p>
        </div>
        <NavigationBar/>
        <div className="flex-1 grow">
            <Routes>
              <Route exact path='/' element={<FilterPage/>}/>
              <Route exact path='/filter' element={<FilterPage/>}/>
              <Route exact path='/restore' element={<RestorationPage/>}/>
            </Routes>
        </div>
        <div className="bg-slate-800 text-white text-center py-2 mt-3">
          <p className="italic">Pzzy-Lab Exp #0003</p>
        </div>
      </div>
    </Router>
  );
}


export default App;
