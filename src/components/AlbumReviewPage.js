import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {ReactComponent as DeleteIcon} from './Delete.svg'

import * as config from './config'
import './AlbumReview.css'

import db from './Firebase'
import { ref, set, onValue} from "firebase/database";
import DeleteModal from './DeleteModal';

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
  const [entireAlbum, setEntireAlbum] = useState({})
  const [bgImage, setBgImage] = useState("")
  const [review, setReview] = useState("")
  const [typingTimer, settypingTimer] = useState(null)
  const [modal, setModal] = useState(-1)
  const textareaRef = useRef(null);
  const delay = 300; // Delay in milliseconds (0.3 seconds)

  var releaseDate= new Date(album.releaseDate)

  releaseDate = `${releaseDate.getFullYear()}/${releaseDate.getMonth()}/${releaseDate.getDate()}`

  const handleTextareaResize = () => {
    textareaRef.current.style.height = "auto"; // Reset height to auto to calculate actual height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to actual height
  };

  const typing = (e) =>{
    setReview(e.target.value)
    update_after_delay(e.target.value);
  }

  const deleteClick = (e) => {
    setModal(true)
  }


  function update_after_delay(current_review) {
    // Reset the timer on every keyup event
    clearTimeout(typingTimer);
    // Start a new timer for delay milliseconds
    const tmp = setTimeout(async () => {
      // Run your function here after delay milliseconds
      // This function will run only if user stops typing for delay milliseconds
      console.log('User stopped typing');
      // Call your function here that you want to run after typing delay
      // For example: myFunction();
      try {
        await set(ref(db, `/${id}/albums/${albumId}/review`), current_review);
        console.log('Review updated successfully in Firebase');
      } catch (error) {
        console.error('Failed to update review in Firebase:', error);
      }
    }, delay);
    settypingTimer(tmp)
  }

  useEffect(() => {
    onValue(ref(db, `/${id}/albums`), (datum)=>{
      setEntireAlbum(datum.val())
      const album = datum.val()[albumId]
      setBgImage(album.artworkLarge)
      setAlbum(album)
      setReview(album.review)
    });
  },[albumId,id]);

  useEffect(()=>{
    return () => {
      clearTimeout(typingTimer)
    }
  },[review])

  return (
    <>
    {modal>=0 && <DeleteModal setModal={setModal} id={id} albumId={albumId} albumList={entireAlbum}></DeleteModal>}
    {modal>=0 && <div className='overlay'/>}
    <div style={{
      backgroundImage: `url(${bgImage})`, 
      display:'flex',
    }} 
    className="AlbumReviewPage"
    >

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
        <div className="AlbumTitle">
          <span>{album.name}</span>
          <DeleteIcon onClick={deleteClick} className="Delete"></DeleteIcon>
        </div>
        <div><span className="AlbumAtribute">Artist</span><span>{album.artistName}</span></div>
        <div><span className="AlbumAtribute">Released</span><span>{releaseDate}</span></div>
        <div><span className="AlbumAtribute">Genre</span><span>{album.genre}</span></div>
        <div><span className="AlbumAtribute">Tracks</span><span>{album.trackCount}</span></div>
        {HorizonLine}
        <textarea
          ref={textareaRef}
          className="AlbumReviewBox"
          placeholder='No Review Written'
          value={review}
          onChange={typing}
          onInput={handleTextareaResize}
          wrap="soft"
        ></textarea>
      </span>
    </div>
    </>
  )
}

export default AlbumReviewPage