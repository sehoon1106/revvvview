import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import * as config from './config'
import './AlbumReview.css'

import db from './Firebase'
import { ref, set, onValue} from "firebase/database";

// const album = config.test_data.sehoon1106.albums[1657869377]

const arrow = <svg style={{height:"16px"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>

const HorizonLine = <div
                    style={{
                      width: "30%",
                      textAlign: "center",
                      borderBottom: "1px solid #aaa",
                      lineHeight: "0.1em",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    >
                    </div>


const AlbumReviewPage = () => {
  const {id, albumId} = useParams()
  const [album, setAlbum] = useState({})
  const [bgImage, setBgImage] = useState("")
  var albumInfo=[];
  const [albumInfoHook, setAlbumInfoHook]= useState([])
  
  const generateAlbumInfo = (album) =>{
    var releaseDate= new Date(album.releaseDate)

    releaseDate = `${releaseDate.getFullYear()}/${releaseDate.getMonth()}/${releaseDate.getDate()}`

    console.log(releaseDate)

    albumInfo.push(<div className="AlbumTitle">{album.albumName}</div>)
    albumInfo.push(<div><span className="AlbumAtribute">Artist</span><span>{album.artistName}</span></div>)
    albumInfo.push(<div><span className="AlbumAtribute">Released</span><span>{releaseDate}</span></div>)
    albumInfo.push(<div><span className="AlbumAtribute">Genre</span><span>{album.genre}</span></div>)
    albumInfo.push(<div><span className="AlbumAtribute">Tracks</span><span>{album.trackCount}</span></div>)
    albumInfo.push(<div><span className="AlbumAtribute">Rank</span><span>asdfg</span></div>)
    albumInfo.push(HorizonLine)
    albumInfo.push(<div className="AlbumReviewBox">{album.review}</div>)

    setAlbumInfoHook(albumInfo)
    albumInfo=[];
  }
  
  useEffect(() => {
    onValue(ref(db, `/${id}/albums/${albumId}`), (album)=>{
      setBgImage(album.val().artworkLarge)
      generateAlbumInfo(album.val());
      setAlbum(album.val())
    });
  },[albumId,id]);

  return (
    <div style={{backgroundImage: `url(${bgImage})`, display:'flex'}} className="AlbumReviewPage">
      <span className="AlbumArtworkBox">
        <div>
          <div className="return">
            <Link to={`/${id}`} style={{textDecoration:'none'}}>
              {arrow}
              {"  Return to the Main Page"}
            </Link>
          </div>
          <img className= "AlbumArtwork" src={album.artworkLarge}></img>
        </div>
      </span>
      <span className="AlbumInfoBox">
        {albumInfoHook}
      </span>
    </div>
  )
}

export default AlbumReviewPage