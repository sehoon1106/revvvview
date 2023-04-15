import React, { useState } from 'react'
import AlbumListText from './AlbumListText'
import AlbumListImage from './AlbumListImage'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react'
import './AlbumList.css'

import db from './Firebase'
import { ref, set, onValue} from "firebase/database";

const AlbumListPage = () => {

  const {id} = useParams();
  const [hoveredAlbum, setHoveredAlbum] = useState("test");

  const [albumsList , setAlbumsList] = useState({});
  const [name, setName] = useState("sehoon1106")


  useEffect(()=>{
    onValue(ref(db, `/${id}/`), (album)=>{
        setName(album.val().nickname)
        setAlbumsList(album.val().albums)
    });
  },[])


  return (
    <div className="AlbumListPage">
        <span className="AlbumListImage">
          <AlbumListImage id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum} albumsList={albumsList} setAlbumsList={setAlbumsList} name={name}></AlbumListImage>
        </span>
        <span className="AlbumListText">
          <AlbumListText id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum} albumsList={albumsList} setAlbumsList={setAlbumsList}></AlbumListText>
        </span>
    </div>
  )
}

export default AlbumListPage