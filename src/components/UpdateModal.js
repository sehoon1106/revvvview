import React from 'react'
import './UpdateModal.css'

import db from './Firebase'
import { useState } from 'react';
import { ref, set} from "firebase/database";

const UpdateModal = ({setModal, id, gradeId, albumList}) => {
    // console.log(albumList)
    const [grade, setGrade] = useState(albumList[gradeId].name)
    
    const close_modal = () =>{
        setModal(-1)
    }

    const typing = (e) =>{
        setGrade(e.target.value)
    }
    
    const update_album = async () =>{
        if(grade.length<1) return;
        await set(ref(db, `/${id}/albums/${gradeId}/name`), grade)
        console.log(`/${id}/albums/${gradeId}/name`)
        setModal(-1)
    }
    
    return (
        <div className="UpdateModal">
            <div className='inputBox'>
                <input className="UpdateModalText" value={grade} onChange={typing}
                        placeholder='Grade should be more than 1 letter'></input>
                </div>
            <div className='buttonBox'>
                <button className="cancleButton" onClick={close_modal}>Cancle</button>
                <button className="doneButton" onClick={update_album} disabled={grade.length<1}>Save</button>
            </div>
        </div>
    )
}

export default UpdateModal