import React, { useState, useRef } from 'react';
import AlbumListText from './AlbumListText';
import AlbumListImage from './AlbumListImage';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import './AlbumList.css';


import db from './Firebase';
import { ref, onValue } from "firebase/database";
import { getAuth } from 'firebase/auth';


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