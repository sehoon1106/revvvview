import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './AlbumList.css'
import {ReactComponent as DeleteIcon} from './Delete.svg'
import {ReactComponent as UpdateIcon} from './Update.svg'
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';
import AddModal from './AddModal';

import db from './Firebase'
import { ref, set} from "firebase/database";

const AddButton_svg= <svg className='AddButton' viewBox="0 0 6 133" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="73" x2="3" y2="133"/><line x1="3" y1="60" x2="3" y2="-1.19249e-08" /><line x1="6" y1="66" x2="-8.74228e-08" y2="66" /><line x1="3" y1="63" x2="3" y2="69" /></svg>

const AlbumListImage = ({id, hoveredAlbum, setHoveredAlbum, albumsList, setAlbumsList, name, is_owner}) => {
    // const album = config.test_data.sehoon1106.albums;   
    const [ModalData, setModalData] = useState({})
    const [modal, setModal] = useState(-1)
        
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
        // console.log(`dragging: ${tmp} target: ${target}`)

        insert_album(tmp,target)
    }

    const open_modal = (modal_no, prev,next) => {
        if(modal_no===0){
            setModal(0)
            setModalData(albumsList[hoveredAlbum])
        }
        else if (modal_no===1){
            setModal(1)
            setModalData(albumsList[hoveredAlbum])
        }
        else if(modal_no===2){
            setModal(2)
            setModalData({prev:prev, next:next, id:id})
        }
    }

    const find_n_before_now = (id, list, n) => {
        if(id===null || list===null || n===null || id===undefined || list===undefined || n===undefined) return;
        var target_album=list[id]
        for(var i=0; i<n; i++){
            target_album = {...list[target_album.prev]}
        }
        return target_album
    }

    const generateAlbumsList = (album) => {
        var tmp_albumsList=[];
        let tmp = album[album.head];
        let last_node = {};
        let albumArr = [];
        let count = 0;
        var is_first = true;

        while (tmp) {
            // console.log(tmp.name);
            if (tmp.artistName===null || tmp.artistName===undefined) {
                if (count > 0) {
                    tmp_albumsList.push(<div key={"album_box "+tmp.name} className="album_box">
                            <span
                            className='AddButtonBox' 
                            key={"album_box "+tmp.name}
                            prev={find_n_before_now(tmp.id, albumsList, count+1).id}
                            next={find_n_before_now(tmp.id, albumsList, count).id}
                            onClick={(e)=>{
                                open_modal(2,e.currentTarget.getAttribute('prev'),e.currentTarget.getAttribute('next'))
                            }}>
                                {is_owner?AddButton_svg:null}
                            </span>
                            {albumArr}
                            </div>);
                    albumArr = [];
                }
                if(is_first===false){
                    tmp_albumsList.push(<div key={"divide_line "+tmp.name} className="divide_line"></div>);
                }
                is_first=false;
                tmp_albumsList.push(<div id={tmp.id} onMouseEnter={changeHoveredAlbum} onMouseLeave={resetHoveredAlbum}>
                                    <span
                                    key={"Grade "+tmp.name}
                                    id={`${tmp.id}`}
                                    onDragEnter = {(e)=>{
                                        e.preventDefault()
                                        if(e.target.getAttribute("id")!==albumsList.head) enter_album(dragging, e.target.getAttribute("id"))
                                    }}
                                    className="Grade"
                                    >
                                        {tmp.name}
                                        <span
                                            style={{display: `${(is_owner && hoveredAlbum===tmp.id)?"flex":"none"}`, alignItems:"end", marginLeft:'10px'}}
                                        >
                                            <span className='IconBox' style={{display:`${albumsList.head===tmp.id?'none':''}`}}>
                                                <DeleteIcon className="Icon" id="delete" onClick={()=>open_modal(0)}></DeleteIcon>
                                            </span>
                                            <span className='IconBox'>
                                                <UpdateIcon className='Icon' id="update" onClick={()=>open_modal(1)}></UpdateIcon>
                                            </span>
                                            <span className='IconBox'>
                                                <svg xmlns="http://www.w3.org/2000/svg" id="plus" viewBox="0 0 20 20"
                                                className='Icon' prev={tmp.id} next={tmp.next} onClick={(e)=>{
                                                    open_modal(2,e.currentTarget.getAttribute('prev'),e.currentTarget.getAttribute('next'))
                                                }}>
                                                    <path fill="inherit" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z"/></svg>
                                            </span>
                                        </span>
                                    </span>
                                    </div>);
                count = 0;
                
            } else {
                if (count === 0) {
                    albumArr = [];
                }
                if (tmp.artistName) {
                    albumArr.push(
                        <>
                        <span
                        key={"album_img "+tmp.name}
                        onDragOver={(event)=>event.preventDefault()}
                        >
                            <Link to={`${tmp.id}`}>
                            <img
                                src={tmp.artworkSmall} alt={tmp.name}
                                id={tmp.id}
                                onMouseEnter={changeHoveredAlbum}
                                onMouseOut={resetHoveredAlbum}
                                draggable={is_owner?'true':'false'}
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
                                onDrop = {async (e)=>{
                                    setDraggingHook("");
                                    await set(ref(db, `/${id}/albums`),
                                        albumsList
                                    )
                                }}
                                style={{
                                    outline: tmp.id===hoveredAlbum?'2px solid white' : 'none',
                                    cursor: tmp.id===hoveredAlbum?'pointer' : 'none'
                                }}
                                className="album_img"/>
                            </Link>
                        </span>
                        <span className='AddButtonBox'
                        prev={tmp.id}
                        next={tmp.next}
                        onClick={(e)=>{
                            open_modal(2,e.currentTarget.getAttribute('prev'),e.currentTarget.getAttribute('next'))
                        }}
                        key={`AddButton ${tmp.id} ${tmp.next}`}>{is_owner?AddButton_svg:null}</span></>)

                    count++;
                }
                if (count === 5) {
                    albumArr = <div key={"album_box "+tmp.name} className="album_box">
                                    <span 
                                    className='AddButtonBox' 
                                    key={"album_box "+tmp.name}
                                    prev={find_n_before_now(tmp.id, albumsList, 5).id}
                                    next={find_n_before_now(tmp.id, albumsList, 4).id}
                                    onClick={(e)=>{
                                        open_modal(2,e.currentTarget.getAttribute('prev'),e.currentTarget.getAttribute('next'))
                                    }}>
                                        {is_owner?AddButton_svg:null}</span>
                                    {albumArr}
                                </div>;
                    tmp_albumsList.push(albumArr);
                    count = 0;
                }
            }
            last_node=tmp;
            tmp = album[tmp.next];
        }
        
        if(last_node.artistName===undefined){
            tmp_albumsList.push(
                <div className='add_album_box'
                    prev={last_node.id}
                    next=""
                    onClick={(e)=>{
                        open_modal(2,e.currentTarget.getAttribute('prev'),e.currentTarget.getAttribute('next'))
                    }} >
                    <svg xmlns="http://www.w3.org/2000/svg" className='add_album_plus' viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z"/></svg>
                </div>)
        }

        if (count > 0) {
            albumArr = <div key={"album_box last"} className="album_box">
                            <span 
                            className='AddButtonBox' 
                            key={"album_box "+last_node.name}
                            prev={find_n_before_now(last_node.id, albumsList, count).id}
                            next={find_n_before_now(last_node.id, albumsList, count-1).id}
                            onClick={(e)=>{
                                open_modal(2,e.currentTarget.getAttribute('prev'),e.currentTarget.getAttribute('next'))
                            }} 
                            >{is_owner?AddButton_svg:null}</span>
                            {albumArr}
                        </div>;
            tmp_albumsList.push(albumArr);
        }
        return tmp_albumsList
    }

    return (
        <div style={{textAlign:"left"}}>
            {modal>=0 && <div className='overlay'/>}
            {modal===0 && <DeleteModal setModal={setModal} id={id} albumId={ModalData.id} albumList={albumsList} gradeName={ModalData.gradeName}></DeleteModal>}
            {modal===1 && <UpdateModal setModal={setModal} id={id} gradeId={ModalData.id} albumList={albumsList}></UpdateModal>}
            {modal===2 && <AddModal setModal={setModal} id={id} prev={ModalData.prev} next={ModalData.next} albumList={albumsList}></AddModal>}
            <div className="userName">{name}</div>
            {generateAlbumsList(albumsList)}
        </div>
    );
}

export default AlbumListImage