import React, { useState } from 'react'
import { useEffect } from 'react'
import * as config from './config'
import './AlbumList.css'

const AddButton_svg = <svg className='AddButton' viewBox="0 0 6 133" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="73" x2="3" y2="133"/><line x1="3" y1="60" x2="3" y2="-1.19249e-08" /><line x1="6" y1="66" x2="-8.74228e-08" y2="66" /><line x1="3" y1="63" x2="3" y2="69" /></svg>

const AlbumListImage = ({hoveredAlbum, setHoveredAlbum}) => {
    const album = config.test_data.sehoon1106.albums;   
    
    var albumsList=[];
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
                    albumsList.push(<div key={"album_box "+tmp.gradeName} className="album_box">{AddButton_svg}{albumArr}</div>);
                    albumArr = [];
                }
                if(is_first===false)
                    albumsList.push(<div key={"divide_line "+tmp.gradeName} className="divide_line"></div>);
                is_first=false;
                albumsList.push(<div key={"Grade "+tmp.gradeName} className="Grade">{tmp.gradeName}</div>);
                count = 0;
                tmp = album[tmp.next];
            } else {
                if (count === 0) {
                    albumArr = [];
                }
                if (tmp.albumName) {
                    albumArr.push(
                        <span key={"album_img "+tmp.albumName}>
                            <img
                                src={tmp.artworkSmall} alt={tmp.albumName}
                                id={tmp.albumId}
                                onMouseEnter={changeHoveredAlbum}
                                onMouseOut={resetHoveredAlbum}
                                style={{
                                    outline: tmp.albumId===hoveredAlbum?'2px solid white' : 'none',
                                    cursor: tmp.albumId===hoveredAlbum?'pointer' : 'none'
                                }}
                                className="album_img"/>
                        </span>
                    );
                    albumArr.push(AddButton_svg)
                    count++;
                }
                if (count === 5) {
                    albumArr = <div key={"album_box "+tmp.albumName}className="album_box">{AddButton_svg}{albumArr}</div>;
                    albumsList.push(albumArr);
                    count = 0;
                }
                tmp = album[tmp.next];
            }
        }

        if (count > 0) {
            albumArr = <div key={"album_box last"} className="album_box">{AddButton_svg}{albumArr}</div>;
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
            <div className="userName">@_sehhhhoon</div>
            {albumsListHook}
        </div>
    );
}

export default AlbumListImage