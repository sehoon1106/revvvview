import React from 'react'
import './DeleteModal.css'

import db from './Firebase'
import { ref, remove, set} from "firebase/database";
import { useNavigate } from 'react-router-dom';

const DeleteModal = ({setModal, id, albumId, albumList}) => {
    // console.log(albumList)
    const navigate = useNavigate();
    
    const close_modal = () =>{
        setModal(-1)
    }
    
    const delete_album = () =>{

        var tmp_list = {...albumList}

        const connect_data = (datum_addr, target, direction) => {
            if((tmp_list[datum_addr]===null)||(tmp_list[datum_addr]===undefined)) return;

            // 1 datum -> target
            if(direction===1){
                tmp_list[datum_addr].next = target
            }
            // 0 target <- datum
            else{
                tmp_list[datum_addr].prev = target;
            }
        }
        
        const prev = tmp_list[albumId].prev
        const next = tmp_list[albumId].next

        connect_data(prev, next, 1)
        connect_data(next, prev, 0)

        setModal(false)

        navigate(`/${id}`)
        
        set(ref(db, `/${id}/albums/`),
            tmp_list
        )
        remove(ref(db, `/${id}/albums/${albumId}`));
        setModal(-1)
    }
    
    return (
        <div className="DeleteModal">
            <div className="warningText">Do you really want to delete?</div>
            <div className='buttonBox'>
                <button className="cancleButton" onClick={close_modal}>Cancle</button>
                <button className="deleteButton" onClick={delete_album}>Delete</button>
            </div>
        </div>
    )
}

export default DeleteModal