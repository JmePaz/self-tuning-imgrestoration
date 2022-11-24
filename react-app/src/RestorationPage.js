import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import piexif from '../node_modules/piexifjs/piexif.js';
function RestorationPage() {
  const [prevImg, updatePrevImg] = useState(()=>{return logo;});
  const [restoredImg, updateRestImg] = useState(()=>{})
  const [filterType, updateFilterType] = useState(()=>{return "";});
  const [kernel, updateKernel] = useState(()=>{return "";})
  
  var loading = undefined;
  var kernelInLoad = undefined;
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
        kernelInLoad = data[1];
        updateFilterType(data[0])
        updateKernel(data[1])
        return data
      }
      else{
        console.log('Not Detected')
      }
    }
    catch(err){
      console.log('Error')
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
       const primaryData = {'img':imgB64, 'kernel': exifData[1]}
    //     //fetching
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
            // // the kernel used 
            // //console.log('Kernel Used:\n'+data['spec-kernel']) // [For debug]

            // // save kernel
            // var newImg = saveKernelonImg(data['spec-kernel'], "data:image/jpeg;base64,"+data["mod-img"])

            // // this set to the preview image
            // updatePrevImg(newImg)
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
  return (
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
          <div className="w-full my-4">
            <button className="p-4 border bg-green-700 rounded text-white py-[8px]"> Download Restored Img </button>
            <p><span className="font-bold">Detected Filter Type:</span> {filterType}</p>
            <p className="font-bold">Detected Kernel Used:</p>
            <p>{kernel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RestorationPage;
