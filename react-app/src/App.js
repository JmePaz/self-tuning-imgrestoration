import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  const [prevImg, updateImg] = useState(()=>{return "";});
  const [filterType, updateFilterType] = useState(()=>{return "default";})
  const [filterStrength, updateFilterStrength] = useState(()=>{ return 0;})
  const [data, setData] = useState(()=>{return [{}]});

  //for UI
  const [visibLoading, updateVisibLoading] = useState(()=>{return "invisible"})

  var loading = undefined;
  const applyFilterImg = () => {
    // if loading = undefined
    if(loading === undefined){
        loading = document.getElementById("loading-img");
    }

    loading.style.visibility = "visible";
    //debug
    console.log('requesting Filter');

    //data required
    const imgB64 = prevImg.replace(/^data:image\/\D+;base64,/gm, "");
    const primaryData = {'filterType': filterType, 'filterStrength': filterStrength, 'img':imgB64}
    
    //fetching
    fetch("http://localhost:5000/filterRequest", {
       method: 'POST', // *GET, POST, PUT, DELETE, etc.
       mode: 'cors', // no-cors, *cors, same-origin
       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
       headers: {
         'Content-Type': 'application/json'
       },
        body: JSON.stringify(primaryData) // body data type must match "Content-Type" header
    })
    .then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data['status'])
        if(data['status']==true){
          console.log("Filtering Img")
          updateImg("data:image/jpeg;base64,"+data["mod-img"])
       }
      }
    ).then(
      res =>{
        loading.style.visibility = "hidden";
      }
    )
    
    
  };

  // useEffect(()=>{
  //   applyFilterImg();
  
  // }, [])

  const displayHello = () => {
    alert('Filter Type: '+filterType +'-'+filterStrength)
  }

  function setBase64Img(file){
    var fr = new FileReader();
    fr.readAsDataURL(file);

    fr.onload = function () {
      updateImg(fr.result);
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

  const changeFilterType = (e) => {
    updateFilterType(prev => e.target.value)
    console.log('Filter Type ', filterType);
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="w-full h-20 bg-blue-900 text-white flex items-center">
        <p className="text-4xl mx-[4em] font-semibold">Self-tuning Image Restoration</p>
      </div>
      {/* Filter Machine */}
      <div className="w-full flex grow pt-20" >
        <div className="w-full flex justify-end mr-20">
          <div>
            <input type="file" className= "p-4 border bg-green-800 rounded text-white min-w-[6em] py-[6px]" accept=".jpg,.jpeg" onChange={getImgFile}/>
            <div className="min-h-[25em] w-[27em] mt-5 bg-slate-200 rounded flex items-center">
              <img id="prev-img" src={prevImg} width="95%" className="mx-auto"/>
              <div id="loading-img" width="95%" height="100%" className="invisible fixed z-10 left-1/4 flex items-center mx-auto bg-slate-700 rounded p-3" >
                <img src={logo} width="70px" height="70px" className="animate-spin" alt="loading screen"/>
                <p className="text-white font-bold">Loading...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start ml-20">
          <div className = "min-w-[27em]">
            <div className = "flex items-center">
              <p className = "text-lg italic">Filter Type:</p>
              <select className="p-4 border-4 border-blue-900 bg-white rounded ml-[1em] py-[6px]" defaultValue={filterType} onChange={e => updateFilterType(e.target.value)}>
                <option id="filter-type" value="default"  disabled hidden >Select a Filter</option>
                <option value="Sharpen">Sharpen</option>
                <option value="GausBlur">Gaussian Blur</option>
                <option value="BoxBlur">Box Blur</option>
              </select>
            </div>
            <div className="w-full mt-8">
              <p className="text-lg italic">Filter Strength:</p>
              <input  id="filter-strength" type="range" min ="0" max="10" step="1" className="w-full" defaultValue={filterStrength} onMouseUp={e => updateFilterStrength(e.target.value)}></input>
              <div className="w-full flex flex-row">
                <p>0</p>
                <p className="grow text-center">5</p>
                <p>10</p>
              </div>
            </div>
            <div className="min-h-[10em] flex">
              <button className="p-4 border bg-blue-900 rounded text-white self-end min-w-[8em] py-[8px]" onClick={applyFilterImg}>Apply Filter</button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 text-white text-center h-7">
        <p>Pzzy-Lab Exp #0003</p>
      </div>
    </div>
  );
}


export default App;
