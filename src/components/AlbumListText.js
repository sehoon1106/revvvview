import React, { useState } from 'react'
import { useEffect } from 'react'
import * as config from './config'
import './AlbumList.css'


const AlbumListText = ({hoveredAlbum, setHoveredAlbum}) => {
    const album = config.test_data.sehoon1106.albums;   
    
    var albumsList=[<div className="userNameHolder"></div>];
    const [albumsListHook, setAlbumsListHook] = useState([]);

    const changeHoveredAlbum = (event) =>{
        setHoveredAlbum(event.target.id)
    }
    const resetHoveredAlbum = () => {
        setHoveredAlbum("")
    }

    const generateAlbumsList = () => {
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
                    albumsList.push(<div key={"album_text_box "+tmp.gradeName} className="album_text_box">{albumArr}</div>);
                    albumArr = [];
                }
                if(is_first===false)
                    albumsList.push(<div key={"divide_line "+tmp.gradeName} className="divide_line"></div>);
                is_first=false;
                albumsList.push(<div key={"grade_box_inital "+tmp.gradeName} className="grade_box_initial"></div>);
                count = 0;
                tmp = album[tmp.next];
            } else {
                if (count === 0) {
                    albumArr = [];
                }
                if (tmp.albumName) {
                    albumArr.push(
                        <div 
                        key={"albumNameBox "+tmp.albumName}
                        id={tmp.albumId}
                        className={"albumNameBox albumName"}
                        onMouseEnter={changeHoveredAlbum}
                        onMouseOut={resetHoveredAlbum}
                        style={{
                            outline: tmp.albumId===hoveredAlbum?'2px solid white' : 'none',
                            background: tmp.albumId===hoveredAlbum?'#FFFFFF' : 'none',
                            borderRadius: tmp.albumId===hoveredAlbum?'6px' : 'none',
                            color: tmp.albumId===hoveredAlbum?'black' : 'white',
                            cursor: tmp.albumId===hoveredAlbum?'pointer' : 'none'
                        }}
                        >
                            {tmp.albumName}
                        </div>
                    );
                    count++;
                }
                if (count === 5) {
                    albumArr = <div key={"album_box "+tmp.albumName} className="album_text_box">{albumArr}</div>;
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
            albumArr = <div key={"album_text_box last"} className="album_text_box">{albumArr}</div>;
            albumsList.push(albumArr);
        }
        setAlbumsListHook(albumsList)
        albumsList=[]
    }

    useEffect(() => {
        generateAlbumsList();
    }, [hoveredAlbum]);
    

    return (
        <div style={{textAlign:"left"}}>
            {albumsListHook}
        </div>
    );
}

export default AlbumListText


