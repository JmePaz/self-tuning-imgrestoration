import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import piexif from '../node_modules/piexifjs/piexif.js';


function FilterPage() {

    const [origImage, updateOrigImg] = useState(() => {return "";})
    const [prevImg, updatePrevImg] = useState(()=>{return "";});
    const [filterType, updateFilterType] = useState(()=>{return "default";})
    const [filterStrength, updateFilterStrength] = useState(()=>{ return 0;})
    const [data, setData] = useState(()=>{return [{}]});
  
    //for UI
    const [visibLoading, updateVisibLoading] = useState(()=>{return "invisible"})
  
    var loading = undefined;
  
    const dowloadPrevImg = () => {
      var dl = document.createElement("a");
      dl.href = prevImg;
      dl.download = "FilteredImage.jpeg";
      dl.click();
    }
  
    const saveKernelonImg = (kernel, img) => {
      // from piexifjs
      var exif_dict = {
        "0th": {},
        "Exif": {},
        "GPS": {},
        "Interop": {},
        "1st": {},
        "thumbnail": null
      };
      //add it as a user comment
      exif_dict["Exif"][37510] = "Kernel used:\n"+kernel;
      
      //insert to the image
      const exif_bytes = piexif.dump(exif_dict);
      return piexif.insert(exif_bytes, img);
    }
  
  
    const applyFilterImg = () => {
      // if loading = undefined
      if(loading === undefined){
          loading = document.getElementById("loading-img");
      }
      loading.style.visibility = "visible";
  
      //data required
      const imgB64 = origImage.replace(/^data:image\/\D+;base64,/gm, "");
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
  
            if(data['status']==true){
              // the kernel used 
              //console.log('Kernel Used:\n'+data['spec-kernel']) // [For debug]
  
              // save kernel
              var newImg = saveKernelonImg(data['spec-kernel'], "data:image/jpeg;base64,"+data["mod-img"])
  
              // this set to the preview image
              updatePrevImg(newImg)
  
            }
            else if (data['status']==false){
              updatePrevImg(origImage)
            }
          }
        ).then(
          res =>{
            loading.style.visibility = "hidden";
          }
      )
      
      
    }
  
    const applyGrayscale = (currImg) => {
      // if loading = undefined
      if(loading === undefined){
        loading = document.getElementById("loading-img");
      }
      loading.style.visibility = "visible";
      
      const imgB64 = currImg.replace(/^data:image\/\D+;base64,/gm, "");
      const primaryData = {'img': imgB64};
  
      fetch("http://localhost:5000/grayscaleRequest", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json'
        },
         body: JSON.stringify(primaryData) // body data type must match "Content-Type" header
     }).then(res => res.json())
     .then(
      data =>{
        setData(data)
        if(data['status'] == true){
          updateOrigImg("data:image/jpeg;base64,"+data["mod-img"]);
          updatePrevImg("data:image/jpeg;base64,"+data["mod-img"])
        }
      }
     ).then(res => {loading.style.visibility="hidden"})
    }
  
    const displayHello = () => {
      alert('Filter Type: '+filterType +'-'+filterStrength)
    }
  
    function setBase64Img(file){
      var fr = new FileReader();
      fr.readAsDataURL(file);
  
      fr.onload = function () {
        const imgB64 = fr.result;
        applyGrayscale(imgB64);
        //updateOrigImg(fr.result);
        //updatePrevImg(fr.result);
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
        <div className="w-full flex grow pt-6" >
          <div className="w-full flex justify-end mr-20">
            <div className = "flex flex-col justify-start">
              <input type="file" className= "p-4 border bg-green-800 rounded text-white w-[20em] py-[6px]" accept=".jpg,.jpeg" onChange={getImgFile}/>
              <p>Note: Images upload will automatically turn into a grayscale image.</p>
              <div className="min-h-[25em] w-[27em] mt-5 bg-slate-200 rounded flex items-center">
                <img id="prev-img" src={prevImg} width="95%" className="mx-auto"/>
                <div id="loading-img" width="95%" height="100%" className="invisible fixed z-10 left-[22%] flex items-center mx-auto bg-slate-700 rounded p-3" >
                  <img src={logo} width="70px" height="70px" className="animate-spin" alt="loading screen"/>
                  <p className="text-white font-bold">Processing...</p>
                </div>
              </div>
              <div className="flex justify-end w-[27em] mt-4">
                <button className="p-4 border bg-blue-900 rounded text-white self-end min-w-[8em] py-[8px]" onClick={dowloadPrevImg}> Download Img </button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-start ml-20 mt-24">
            <div className = "min-w-[27em] h-fit p-3 rounded shadow-2xl">
              <div className = "flex items-center">
                <p className = "text-lg italic">Filter Type:</p>
                <select className="p-4 border-4 border-blue-900 bg-white rounded ml-[1em] py-[6px]" defaultValue={filterType} onChange={e => updateFilterType(e.target.value)}>
                  <option id="filter-type" value="default"  disabled hidden >Select a Filter</option>
                  <option value="Sharpen">Sharpen</option>
                  <option value="GausBlur">Gaussian Blur</option>
                  <option value="BoxBlur">Box Blur</option>
                  <option value="Emboss">Emboss</option>
                  <option value="SampleBlur">Sample Blur</option>
                </select>
              </div>
              <div className="w-full mt-9">
                <p className="text-lg italic">Filter Strength:</p>
                <input  id="filter-strength" type="range" min ="0" max="10" step="1" className="w-full" defaultValue={filterStrength} onChange={e => updateFilterStrength(parseInt(e.target.value))}></input>
                <div className="w-full flex flex-row">
                  <p>0</p>
                  <p className="grow text-center">5</p>
                  <p>10</p>
                </div>
              </div>
              <div className="py-4 flex mt-14">
                <button className="p-4 border bg-blue-900 rounded text-white min-w-[8em] py-[8px]" onClick={applyFilterImg}>Apply Filter</button>
              </div>
            </div>
          </div>
        </div>
    )
}
  
  
export default FilterPage;
  