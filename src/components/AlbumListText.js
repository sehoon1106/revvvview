import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import * as config from './config'
import './AlbumList.css'

import db from './Firebase'
import { ref, set, onValue} from "firebase/database";


const AlbumListText = ({id, hoveredAlbum, setHoveredAlbum}) => {
    
    var albumsList=[<div className="userNameHolder"></div>];
    const [albumsListHook, setAlbumsListHook] = useState([]);
    
    const changeHoveredAlbum = (event) =>{
        setHoveredAlbum(event.target.id)
    }
    const resetHoveredAlbum = () => {
        setHoveredAlbum("")
    }
    
    const generateAlbumsList = (album) => {
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
                    albumsList.push(<span key={"album_text_box "+tmp.gradeName} className="album_text_box">{albumArr}</span>);
                    albumArr = [];
                }
                if(is_first===false)
                    albumsList.push(<span key={"divide_line "+tmp.gradeName} className="divide_line"></span>);
                    is_first=false;
                albumsList.push(<span key={"grade_box_inital "+tmp.gradeName} className="grade_box_initial"></span>);
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
                    albumsList.push(albumArr);
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
            albumsList.push(albumArr);
        }
        setAlbumsListHook(albumsList)
        albumsList=[]
    }

    useEffect(() => {
        onValue(ref(db, `/${id}/albums`), (album)=>{
            generateAlbumsList(album.val());
        });
    }, [hoveredAlbum]);
    
    
    return (
        <div style={{textAlign:"left"}}>
            {albumsListHook}
        </div>
    );
}

export default AlbumListText


