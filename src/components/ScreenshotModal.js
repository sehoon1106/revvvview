import React from 'react'
import './ScreenshotModal.css'

import { useState } from 'react';

import { saveAs } from 'file-saver';


const ScreenshotModal = ({setModal, name, image}) => {
    const [filename, setFileName] = useState("")

    const today = new Date();

    const default_filename = `${name}_${today.getFullYear()}.${today.getMonth()}.${today.getDate()}`
    
    const close_modal = () =>{
        setModal(-1)
    }

    const copyToClipboard = () =>{
        image.toBlob((blob) => {
            var item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
        });
    }
    const downloadScreenshot = () => {
        image.toBlob((blob) => {
            saveAs(blob, `${filename===""?default_filename:filename}.png`);
        });
    }

    const typing = (e) =>{
        setFileName(e.target.value);
    }
    
    return (
        <div className="ScreenshotModal">
            <input value={filename} onChange={typing} id="ScreenshotFileName" placeholder={default_filename}></input><span>.png</span>
            <img src={image.toDataURL()} id="Screenshot" alt="Captured Image"></img>
            <div className='ScreenshotModalbuttonBox'>
                <button id="cancleButton" className="ScreenshotModalButton" onClick={close_modal}>Close</button>
                <button id="copyButton" className="ScreenshotModalButton" onClick={copyToClipboard}>Copy</button>
                <button id="downloadButton" className="ScreenshotModalButton" onClick={downloadScreenshot}>Download</button>
            </div>
        </div>
    )
}

export default ScreenshotModal