import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import * as config from './config'
import './AlbumList.css'
import {ReactComponent as DeleteIcon} from './Delete.svg'
import {ReactComponent as UpdateIcon} from './Update.svg'
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';

import db from './Firebase'
import { ref, set, onValue} from "firebase/database";
import { hover } from '@testing-library/user-event/dist/hover';

const AddButton_svg = <svg className='AddButton' viewBox="0 0 6 133" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="73" x2="3" y2="133"/><line x1="3" y1="60" x2="3" y2="-1.19249e-08" /><line x1="6" y1="66" x2="-8.74228e-08" y2="66" /><line x1="3" y1="63" x2="3" y2="69" /></svg>

const AlbumListImage = ({id, hoveredAlbum, setHoveredAlbum, albumsList, setAlbumsList, name}) => {
    // const album = config.test_data.sehoon1106.albums;   
    const [deleteModal, setDeleteModal] = useState(false)
    const [gradeSelect, setGradeSelect] = useState({})
    const [updateModal, setUpdateModal] = useState(false)
    
    var tmp_albumsList=[];
    const [albumsListHook, setAlbumsListHook] = useState([]);
    var dragging = ""
    const [draggingHook, setDraggingHook] = useState("");
    
    const changeHoveredAlbum = (event) =>{
        setHoveredAlbum(event.target.id)
    }
    const resetHoveredAlbum = () => {
        setHoveredAlbum("")
    }
    
    //check if the target is before(returns 0) or after(returns 1) dragging
    const check_order = (dragging, target) =>{
        var tmp=albumsList[dragging].prev;
        while(tmp.length>=1){
            if(tmp===target) return 0;
            tmp=albumsList[tmp].prev
        }
        return 1;
    }

    const insert_album = (dragging, target) => {
        if(dragging===target) return;
        
        var tmp_list = {...albumsList}

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

        const dragging_prev = tmp_list[dragging].prev
        const dragging_next = tmp_list[dragging].next

        const target_prev = tmp_list[target].prev
        const target_next = tmp_list[target].next

        if(!check_order(dragging,target)){
            connect_data(tmp_list[dragging].prev, tmp_list[dragging].next,1)
            connect_data(tmp_list[dragging].next, tmp_list[dragging].prev,0)
    
    
            connect_data(target_prev, dragging, 1)
            connect_data(dragging, target_prev, 0)
            connect_data(dragging, target, 1)
            connect_data(target, dragging, 0)
    
            // console.log()
    
            setAlbumsList(tmp_list)
        }
        else{
            connect_data(tmp_list[dragging].prev, tmp_list[dragging].next,1)
            connect_data(tmp_list[dragging].next, tmp_list[dragging].prev,0)
    
            connect_data(target, dragging, 1)
            connect_data(dragging, target, 0)
            connect_data(dragging, target_next, 1)
            connect_data(target_next, dragging, 0)
    
            // console.log()
    
            setAlbumsList(tmp_list)
        }
    }

    const enter_album = (dragging, target)=>{
        var tmp = dragging;
        if(tmp.length<1) tmp = draggingHook
        console.log(`dragging: ${tmp} target: ${target}`)

        insert_album(tmp,target)
    }

    const open_modal = (is_update) => {
        if(is_update===0){
            setDeleteModal(true)
            setGradeSelect(albumsList[hoveredAlbum])
        }
        else{
            setUpdateModal(true)
            setGradeSelect(albumsList[hoveredAlbum])
        }
    }

    const generateAlbumsList = (album) => {
        let tmp = album[album.head];
        let albumArr = [];
        let count = 0;
        var is_first = true;

        while (tmp) {
            // console.log(tmp.albumName);
            if (tmp.gradeName) {
                if (count > 0) {
                    tmp_albumsList.push(<div key={"album_box "+tmp.gradeName} className="album_box">{AddButton_svg}{albumArr}</div>);
                    albumArr = [];
                }
                if(is_first===false)
                    tmp_albumsList.push(<div key={"divide_line "+tmp.gradeName} className="divide_line"></div>);
                is_first=false;
                tmp_albumsList.push(<div id={tmp.gradeId} onMouseEnter={changeHoveredAlbum} onMouseLeave={resetHoveredAlbum}>
                                    <span
                                    key={"Grade "+tmp.gradeName}
                                    id={`${tmp.gradeId}`}
                                    onDragEnter = {(e)=>{
                                        e.preventDefault()
                                        if(e.target.getAttribute("id")!==albumsList.head) enter_album(dragging, e.target.getAttribute("id"))
                                    }}
                                    className="Grade"
                                    >
                                        {tmp.gradeName}
                                        <span
                                            style={{display: `${hoveredAlbum===tmp.gradeId?"inline-block":"none"}`, marginLeft:'10px'}}
                                        >
                                            <span className='IconBox' style={{display:`${albumsList.head===tmp.gradeId?'none':''}`}}>
                                                <DeleteIcon className="Icon" id="delete" onClick={()=>open_modal(0)}></DeleteIcon>
                                            </span>
                                            <span className='IconBox'>
                                                <UpdateIcon className='Icon' id="update" onClick={()=>open_modal(1)}></UpdateIcon>
                                            </span>
                                        </span>
                                    </span>
                                    </div>);
                count = 0;
                tmp = album[tmp.next];
            } else {
                if (count === 0) {
                    albumArr = [];
                }
                if (tmp.albumName) {
                    albumArr.push(
                        <span
                        key={"album_img "+tmp.albumName}
                        onDragOver={(event)=>event.preventDefault()}
                        >
                            <Link to={`${tmp.albumId}`}>
                            <img
                                src={tmp.artworkSmall} alt={tmp.albumName}
                                id={tmp.albumId}
                                onMouseEnter={changeHoveredAlbum}
                                onMouseOut={resetHoveredAlbum}
                                draggable='true'
                                onDragStart={(event)=>{
                                    dragging = event.target.id
                                    setDraggingHook(dragging)
                                }}
                                onDragOver = {(e)=>{e.preventDefault()}}
                                onDragEnter = {(e)=>{
                                    e.preventDefault()
                                    const target = e.target.getAttribute("id")
                                    enter_album(dragging, target)
                                }}
                                onDrop = {(e)=>{
                                    setDraggingHook("");
                                    set(ref(db, `/${id}/albums`),
                                        albumsList
                                    )
                                }}
                                style={{
                                    outline: tmp.albumId===hoveredAlbum?'2px solid white' : 'none',
                                    cursor: tmp.albumId===hoveredAlbum?'pointer' : 'none'
                                }}
                                className="album_img"/>
                            </Link>
                        </span>
                    );
                    albumArr.push(AddButton_svg)
                    count++;
                }
                if (count === 5) {
                    albumArr = <div key={"album_box "+tmp.albumName}className="album_box">{AddButton_svg}{albumArr}</div>;
                    tmp_albumsList.push(albumArr);
                    count = 0;
                }
                tmp = album[tmp.next];
            }
        }

        if (count > 0) {
            albumArr = <div key={"album_box last"} className="album_box">{AddButton_svg}{albumArr}</div>;
            tmp_albumsList.push(albumArr);
        }
        setAlbumsListHook(tmp_albumsList)
        tmp_albumsList=[]
    }

    useEffect(() => {
        generateAlbumsList(albumsList);
    }, [hoveredAlbum,albumsList]);
    

    return (
        <div style={{textAlign:"left"}}>
            {deleteModal && <DeleteModal setModal={setDeleteModal} id={id} albumId={gradeSelect.gradeId} albumList={albumsList} gradeName={gradeSelect.gradeName}></DeleteModal>}
            {updateModal && <UpdateModal setModal={setUpdateModal} id={id} gradeId={gradeSelect.gradeId} albumList={albumsList}></UpdateModal>}
            <div className="userName">{name}</div>
            {albumsListHook}
        </div>
    );
}

export default AlbumListImage