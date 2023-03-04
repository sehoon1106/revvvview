import React, { useState } from 'react'
import AlbumListText from './AlbumListText'
import AlbumListImage from './AlbumListImage'
import './AlbumList.css'

const AlbumListPage = () => {
  const [hoveredAlbum, setHoveredAlbum] = useState("test");

  return (
    <div>
      <div style={{display:'flex', justifyContent: 'center'}}>
        <span className="AlbumListImage">
          <AlbumListImage hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum}></AlbumListImage>
        </span>
        <span className="AlbumListText">
          <AlbumListText hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum}></AlbumListText>
        </span>
      </div>
    </div>
  )
}

export default AlbumListPage