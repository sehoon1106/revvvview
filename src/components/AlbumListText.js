import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import * as config from './config'
import './AlbumList.css'

import db from './Firebase'
import { ref, set, onValue} from "firebase/database";


const AlbumListText = ({id, hoveredAlbum, setHoveredAlbum, albumsList, setAlbumsList}) => {
    // const album = config.test_data.sehoon1106.albums;   
    

    var dragging = ""
    const [draggingHook, setDraggingHook] = useState("");

    const [albumsListHook, setAlbumsListHook] = useState([]);
    
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
        // console.log(`dragging: ${tmp} target: ${target}`)

        insert_album(tmp,target)
    }
    
    const generateAlbumsList = (album) => {
        var tmp_albumsList=[<div className="userNameHolder"></div>];
        // const album = config.test_data.sehoon1106.albums;
        let tmp = album[album.head];
        let albumArr = [];
        let count = 0;
        var is_first = true;
        
        while (tmp) {
            if (tmp.gradeName) {
                if (count > 0) {
                    for(count; count<5; count++){
                        albumArr.push(<div key={"albumNamebox "+tmp.gradeName+count} className="albumNameBox"></div>)
                    }
                    tmp_albumsList.push(<span key={"album_text_box "+tmp.gradeName} className="album_text_box">{albumArr}</span>);
                    albumArr = [];
                }
                if(is_first===false)
                    tmp_albumsList.push(<span key={"divide_line "+tmp.gradeName} className="divide_line"></span>);
                    is_first=false;
                tmp_albumsList.push(<span key={"grade_box_inital "+tmp.gradeName} className="grade_box_initial"></span>);
                count = 0;
                tmp = album[tmp.next];
            } else {
                if (count === 0) {
                    albumArr = [];
                }
                if (tmp.albumName) {
                    albumArr.push(
                        <Link to={`/${id}/${tmp.albumId}`}>
                        <div 
                        key={"albumNameBox "+tmp.albumName}
                        id={tmp.albumId}
                        className={"albumNameBox albumName"}
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
                            enter_album(dragging, e.target.getAttribute("id"))
                        }}
                        onDrop = {(e)=>{
                            setDraggingHook("");
                            set(ref(db, `/${id}/albums`),
                                albumsList
                            )
                        }}
                        style={{
                            // outline: tmp.albumId===hoveredAlbum?'2px solid white' : 'none',
                            background: tmp.albumId===hoveredAlbum?'#FFFFFF' : 'none',
                            borderRadius: tmp.albumId===hoveredAlbum?'6px' : 'none',
                            color: tmp.albumId===hoveredAlbum?'black' : 'white',
                            cursor: tmp.albumId===hoveredAlbum?'pointer' : 'none'
                        }}
                        >
                                {tmp.albumName}
                        </div>
                        </Link>
                    );
                    count++;
                }
                if (count === 5) {
                    albumArr = <span key={"album_box "+tmp.albumName} className="album_text_box">{albumArr}</span>;
                    tmp_albumsList.push(albumArr);
                    count = 0;
                }
                tmp = album[tmp.next];
            }
        }

        if (count > 0) {
            for(count; count<5; count++){
                albumArr.push(<div key={"album_box last " + count} className="albumNameBox"></div>)
            }
            albumArr = <span key={"album_text_box last"} className="album_text_box">{albumArr}</span>;
            tmp_albumsList.push(albumArr);
        }
        return tmp_albumsList
    }
    
    
    return (
        <div style={{textAlign:"left"}}>
            {generateAlbumsList(albumsList)}
        </div>
    );
}

export default AlbumListText


