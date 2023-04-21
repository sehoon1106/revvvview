import React from 'react'
import './UpdateModal.css'

import db from './Firebase'
import { useState } from 'react';
import { ref, remove, set} from "firebase/database";
import { useNavigate } from 'react-router-dom';

const UpdateModal = ({setModal, id, gradeId, albumList}) => {
    // console.log(albumList)
    const navigate = useNavigate();
    const [grade, setGrade] = useState(albumList[gradeId].gradeName)
    
    const close_modal = () =>{
        setModal(false)
    }

    const typing = (e) =>{
        setGrade(e.target.value)
    }
    
    const update_album = () =>{
        if(grade.length<1) return;
        set(ref(db, `/${id}/albums/${gradeId}/gradeName`), grade)
        setModal(false)
    }
    
    return (
        <div className="modal">
            <div className='inputBox'>
                <input className="inputBox" value={grade} onChange={typing}
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