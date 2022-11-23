import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
function RestorationPage() {
  const [prevImg, updatePrevImg] = useState(()=>{return logo;});

  function setBase64Img(file){
    var fr = new FileReader();
    fr.readAsDataURL(file);

    fr.onload = function () {
      const imgB64 = fr.result;
      //updateOrigImg(fr.result);
      updatePrevImg(fr.result);
    };
    fr.onerror = function (error) {
      console.log('Error: '+error);
    };
  }
  
  const getImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    var files = e.target.files;
    if(files==null||files.length==0){
        alert('Please select a file');
        return;
    }
    var file = e.target.files[0];

    setBase64Img(file);
   
  }
  return (
    <div className="flex w-[95%] h-full mx-auto mt-5">
      <div className="w-1/2 flex flex-col items-center">
        <div>
          <div className="bg-blue-900 rounded-t px-2 py-1 ">
            <p className="text-lg  text-white">Input Image</p>
          </div>
          <input type="file" className= "p-4 border  mt-5 rounded w-[20em] max-h-[40px] py-[6px]" accept=".jpg,.jpeg" onChange={getImgFile}/>
          <div className="h-[25em] w-[35em] mt-5 bg-slate-200 rounded flex flex-col items-center">
            <div id="loading-img" width="95%" height="100%" className="invisible absolute z-10 top-[55%]  flex items-center mx-auto bg-slate-700/80 rounded px-5 py-3" >
              <img src={logo} width="70px" height="70px" className="animate-spin" alt="loading screen"/>
              <p className="text-white font-bold">Loading...</p>
            </div>
            <img id="prev-img" src={prevImg}  className="mx-auto h-full w-auto"/>
          </div>
        </div>
      </div>      
      <div className="w-1/2 flex flex-col items-center">
        <div>
          <div className="bg-green-700 rounded-t px-2 py-1">
            <p className="text-lg  text-white">Restored Image</p>
          </div>
          <div className="min-h-[40px] mt-5">
          </div>
          <div className="h-[25em] w-[35em] mt-5 bg-slate-200 rounded flex flex-col items-center">
            <div id="loading-img" width="95%" height="100%" className="invisible absolute z-10 top-[55%]  flex items-center mx-auto bg-slate-700/80 rounded px-5 py-3" >
              <img src={logo} width="70px" height="70px" className="animate-spin" alt="loading screen"/>
              <p className="text-white font-bold">Restoring...</p>
            </div>
            <img id="prev-img" src={logo} width="95%" className="mx-auto h-full w-auto"/>
          </div>
          <div className="w-full my-4">
            <button className="p-4 border bg-green-700 rounded text-white py-[8px]"> Download Restored Img </button>
            <p>Detected Filter Type: Gaussian Blur</p>
            <p>Detected Kernel Used:</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RestorationPage;
