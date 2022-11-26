import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import piexif from '../node_modules/piexifjs/piexif.js';
function RestorationPage() {
  const [prevImg, updatePrevImg] = useState(()=>{return logo;});
  const [restoredImg, updateRestImg] = useState(()=>{})
  const [filterType, updateFilterType] = useState(()=>{return "";});
  const [kernel, updateKernel] = useState(()=>{return undefined;});
  
  var loading = undefined;
  const FILTER_TYPE = {
    "Sharpen": "Sharpen",
    "GausBlur": "Gaussian Blur",
    "BoxBlur": "Box Blur",
    "Emboss": "Emboss",
    "SampleBlur": "Sample Blur"
  }

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
  function getImgExifData(imgB64){
    try{
      var exifObj = piexif.load(imgB64);
      if('Exif' in exifObj && 37510 in exifObj['Exif']){
        var data = exifObj['Exif'][37510].split(/@\r?\n/gm);
        var filter_type = data[0];
        if(filter_type in FILTER_TYPE){
          filter_type = FILTER_TYPE[filter_type];
        }
        else{
          filter_type = 'undetected';
        }
        
        updateFilterType(filter_type)
        updateKernel(data[1].split(/\r?\n/gm))
        return data[1];
      }
      else{
        updateFilterType('undetected')
        console.log('Not Detected')
        return false;
      }
    }
    catch(err){
      console.log('Error')
      updateFilterType('undetected')
      return false;
    }

  }

   useEffect(() => {
    if(prevImg!=logo){
     restoreImgRequest()
}}, [prevImg])

  const restoreImgRequest = () => {
      // if loading = undefined
      if(loading === undefined){
          loading = document.getElementById("loading-img");
      }
      loading.style.visibility = "visible";

       //data required
       const imgB64 = prevImg.replace(/^data:image\/\D+;base64,/gm, "");
       const exifData = getImgExifData(prevImg);
       if(exifData === false){
        loading.style.visibility = "hidden";
        alert("Kernel Undetected")
        return;
       }
       const primaryData = {'img':imgB64, 'kernel': exifData}
    //     //fetching
    try{
      fetch("http://localhost:5000/restorationRequest", {
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

          if(data['status']==true){
            updateRestImg("data:image/jpeg;base64,"+data['restored-img'])
          }
          else{
            alert(data['remarks'])
          }
          console.log(data)
        }
      ).then(
        res =>{
          loading.style.visibility = "hidden";
        }
      )
    }
    catch(err) {
      alert("Error in server fetching");
      loading.style.visibility = "hidden";
    }
  }

  const DisplayKernel = () => {
    if(kernel=="" || kernel==undefined){
      return (<div className="px-2"><p>None</p></div>);
    }
    const kernelP1 = kernel.map( (k, i) => k.split(/[ ]+/gm))
    console.log(kernelP1)
    return (
        <table className="border-separate border-spacing-x-7 text-lg">
          {kernelP1.map((row, i)=> <tr>{ (row.map((cell, i)=> <td className="border text-center">{cell}</td>))}</tr>)
          }
        </table>
    )
  }

  const dowloadRestoredImg = () => {
    if(prevImg==logo || prevImg==""){
      alert("Please wait/insert an image first")
      return;
    }
    var dl = document.createElement("a");
    dl.href = restoredImg;
    dl.download = "RestoredImage.jpeg";
    dl.click();
  }

  return (
    // <>
      // {addKernel()}
    // </>
    <div className="flex w-[95%] h-full mx-auto mt-5">
      <div className="w-1/2 flex flex-col items-center">
        <div>
          <div className="bg-blue-900 rounded-t px-2 py-1 ">
            <p className="text-lg  text-white">Input Image</p>
          </div>
          <input type="file" className= "p-4 border  mt-5 rounded w-[20em] max-h-[40px] py-[6px]" accept=".jpg,.jpeg" onChange={getImgFile}/>
          <div className="h-[25em] w-[35em] mt-5 bg-slate-200 rounded flex flex-col items-center">
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
            <img id="restored-img" src={restoredImg} width="95%" className="mx-auto h-full w-auto"/>
          </div>
          <div className="w-full mb-4 mt-2">
            <button className="p-4 border bg-green-700 rounded text-white py-[8px]" onClick={dowloadRestoredImg}> Download Restored Img </button>
            <p className = "mt-4"><span className="font-bold">Detected Filter Type: </span><span className="text-lg">{filterType}</span></p>
            <div className="flex mt-1">
              <p className="font-bold">Detected Kernel Used:</p>
              <div className="ml-3 mt-3 w-fit bg-slate-200 border-x-4 border-sky-500">
                <div className="flex">
                  <div className="w-[20%] h-4 border-t-4 border-sky-500">
                  </div>
                  <div className="grow">
                  </div>
                  <div className="w-[20%] h-4 border-t-4 border-sky-500">
                  </div>
                </div>
                {/* <p>{kernel}</p> */}
                <div className="">
                  {DisplayKernel()}
                </div>
                <div className="flex">
                  <div className="w-[20%] h-4 border-b-4 border-sky-500">
                  </div>
                  <div className="grow">
                  </div>
                  <div className="w-[20%] h-4 border-b-4 border-sky-500">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RestorationPage;
