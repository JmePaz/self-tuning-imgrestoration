import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
function RestorationPage() {

  return (
    <div className="flex w-[95%] h-full mx-auto mt-5">
      <div className="w-1/2 flex flex-col items-center">
        <div>
          <div className="bg-blue-900 rounded-t px-2 py-1 ">
            <p className="text-lg  text-white">Input Image</p>
          </div>
          <input type="file" className= "p-4 border  mt-5 rounded w-[20em] max-h-[40px] py-[6px]" accept=".jpg,.jpeg"/>
          <div className="min-h-[25em] w-[35em] mt-5 bg-slate-200 rounded">
            <img id="prev-img" src="" width="95%" className="mx-auto"/>
            <div id="loading-img" width="95%" height="100%" className="invisible fixed z-10 left-[22%] flex items-center mx-auto bg-slate-700 rounded p-3" >
              <img src={logo} width="70px" height="70px" className="animate-spin" alt="loading screen"/>
              <p className="text-white font-bold">Processing...</p>
            </div>
          </div>
        </div>
      </div>      
      <div className="w-1/2 flex flex-col items-center">
        <div>
          <div className="bg-green-900 rounded-t px-2 py-1">
            <p className="text-lg  text-white">Restored Image</p>
          </div>
          <div className="min-h-[40px] mt-5">
          </div>
          <div className="min-h-[25em] w-[35em] mt-5 bg-slate-200 rounded">
            <div id="loading-img" width="95%" height="100%" className="visible absolute z-10  flex items-center mx-auto bg-slate-700 rounded p-3" >
              <img src={logo} width="70px" height="70px" className="animate-spin" alt="loading screen"/>
              <p className="text-white font-bold">Restoring...</p>
            </div>
            <img id="prev-img" src={logo} width="95%" className="mx-auto"/>
          </div>
          <div className="w-full my-4">
            <button className="p-4 border bg-green-900 rounded text-white py-[8px]"> Download Restored Img </button>
            <p>Detected Filter Type: Gaussian Blur</p>
            <p>Detected Kernel Used:</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RestorationPage;
