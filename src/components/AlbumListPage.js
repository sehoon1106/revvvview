import React, { useState, useRef } from 'react';
import AlbumListText from './AlbumListText';
import AlbumListImage from './AlbumListImage';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import './AlbumList.css';

import db from './Firebase';
import { ref, onValue } from "firebase/database";
import { getAuth } from 'firebase/auth';
import BackgroundParticles from './BackgroundParticles';


const AlbumListPage = () => {
  const auth = getAuth();
  const pageRef = useRef(null);

  const { id } = useParams();
  const [hoveredAlbum, setHoveredAlbum] = useState("test");

  const [albumsList, setAlbumsList] = useState({});
  const [name, setName] = useState("");
  const [is_owner, setOwner] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (id === "sehoon1106" || (user && user.uid === id)) {
        setOwner(true);
      } else {
        setOwner(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    onValue(ref(db, `/${id}/`), (album) => {
      setName(album.val().nickname);
      setAlbumsList(album.val().albums);

      document.title = `${album.val().nickname}'s Topster`;
    });
  }, []);

  

  return (
    <>
    <div className="AlbumListPage" ref={pageRef}>
      <div className="backgroundWrapper">
        <BackgroundParticles></BackgroundParticles>
      </div>
      {/* <div style={{
        position:"absolute", 
        outline:"1px solid red", 
        display:"block", 
        width:"100%",
        top:"0", 
        bottom:"0", 
        zIndex:"-2",
        backdropFilter:"blur(0)"}}>
      <div className="backgroundWrapper">
        <BackgroundParticles></BackgroundParticles>
      </div>
      </div> */}
      <div style={{
        backdropFilter: "blur(2.5px)",
        WebkitBackdropFilter: "blur(2.5px)",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex:"-1"
      }}></div>
      <span className="AlbumListImage">
        <AlbumListImage id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum} albumsList={albumsList} setAlbumsList={setAlbumsList} name={name} is_add_page={false} is_owner={is_owner}></AlbumListImage>
      </span>
      <span className="AlbumListText">
        <AlbumListText id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum} albumsList={albumsList} setAlbumsList={setAlbumsList} name={name} is_owner={is_owner} pageRef={pageRef}></AlbumListText>
      </span>
    </div>
    </>
  );
};

export default AlbumListPage;