import React, { useState } from 'react'
import AlbumListText from './AlbumListText'
import AlbumListImage from './AlbumListImage'
import { useParams } from 'react-router-dom';
import './AlbumList.css'

const AlbumListPage = () => {

  const {id} = useParams();
  const [hoveredAlbum, setHoveredAlbum] = useState("test");

  return (
    <div className="AlbumListPage">
        <span className="AlbumListImage">
          <AlbumListImage id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum}></AlbumListImage>
        </span>
        <span className="AlbumListText">
          <AlbumListText id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum}></AlbumListText>
        </span>
    </div>
  )
}

export default AlbumListPage