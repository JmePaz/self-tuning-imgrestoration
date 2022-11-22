import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router,Routes,Route, Link} from 'react-router-dom';
import FilterPage from './FilterPage'
import RestorationPage from './RestorationPage'

var currSelector = undefined;
const display = (e) => {
    e.target.style.textDecoration = 'underline'
    if(currSelector!==undefined){
        currSelector.style.textDecoration = 'none'
    }
    currSelector = e.target;
}

function NavigationBar(){
    return (
        <div className="bg-slate-800">
            <ul className="flex ml-[2.5em] text-white">
                <li className="py-3 hover:underline hover:scale-125 transition ease-in-out delay-100" onClick={display}>
                    <Link to='/filter'>Filter Image</Link>
                </li>
                <li className="ml-[3em] py-3 hover:underline hover:scale-125  transition ease-in-out delay-100" onClick={display}>
                    <Link to='/restore'>Restore Image</Link>
                </li>
            </ul>
        </div>
    );
}

export default NavigationBar;