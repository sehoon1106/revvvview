import React, { useState, useRef } from 'react';
import AlbumListText from './AlbumListText';
import AlbumListImage from './AlbumListImage';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import './AlbumList.css';

import db from './Firebase';
import { ref, onValue } from "firebase/database";
import { GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence, signInWithRedirect, signOut } from 'firebase/auth';
import BackgroundParticles from './BackgroundParticles';


const AlbumListPage = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

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

  const signInGoogle = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithRedirect(auth, provider);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const signOutHandler = () => {
      signOut(auth)
      .then(() => {
          setOwner(false);
          })
          .catch((error) => {
          console.log(error);
          });
  };

  return (
    <div>
      <div className="AlbumListPage" ref={pageRef}>
        {/* <div className="backgroundWrapper">
          <BackgroundParticles></BackgroundParticles>
        </div>
        <div style={{
          backdropFilter: "blur(2.5px)",
          WebkitBackdropFilter: "blur(2.5px)",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex:"-1"
        }}></div> */}
        <div className="AlbumListPageContentWrapper">
          <div className="userNameWrapper">
            <div className="userName">{name}</div>
            {is_owner?
            <div id='LogInText'onClick={signOutHandler}>Log Out</div>:
            <div id='LogInText'onClick={signInGoogle}>Log In</div>}
          </div>
          <span className="AlbumListImage">
            <AlbumListImage id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum} albumsList={albumsList} setAlbumsList={setAlbumsList} name={name} is_add_page={false} is_owner={is_owner}></AlbumListImage>
          </span>
          <span className="AlbumListText">
            <AlbumListText id={id} hoveredAlbum={hoveredAlbum} setHoveredAlbum={setHoveredAlbum} albumsList={albumsList} setAlbumsList={setAlbumsList} name={name} is_owner={is_owner} pageRef={pageRef}></AlbumListText>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlbumListPage;