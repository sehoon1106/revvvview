import React, { useEffect, useState } from 'react'
import "./Login.css"
import { GoogleAuthProvider, browserLocalPersistence, getAuth, getRedirectResult, setPersistence, signInWithRedirect, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { ref, set } from 'firebase/database'
import db from './Firebase'

const Login = () => {
  const google_logo = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 128 128"><path fill="#fff" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38z"/><path fill="#e33629" d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21z"/><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9z"/><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"/><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4z"/></svg>
  
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const [is_logged_in, setLoggedIn] = useState(false)

  const navigate = useNavigate();


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
        setLoggedIn(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const gotoMyPage = () =>{
    if(auth){
      navigate(`/${auth.currentUser.uid}`)
    }
  }

  useEffect(()=>{
    getRedirectResult(auth)
    .then((result)=>{
      if(result===null) return;
      navigate(`/${result.user.uid}`);
    })
  },[])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async(user) => {
      if (user) {
        setLoggedIn(true);
        const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
        
        if(isNewUser){
          await set(ref(db, `/${user.uid}/`),
          {
            albums:{"0000":{id:"0000", name:"Best", next:"", prev:""},head:"0000"},
            nickname: user.displayName
          }
          )
        }

      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // <div id="loginBox">
    //     <div id="signIn">Sign in</div>
    //     <div>Sign in with Google</div>
    //     <input id="inputId"></input>
    //     <input id="inputPW"></input>
    //     <div><button>Sign In</button></div>
    //     <div>Still got no Account? Sign Up Now!</div>
    // </div>
    <div id="tmpBox">
      <div id="welcomeText">
        <div style={{width:"100vw", textAlign:"center"}}>Lobby is under Construction...</div>
        <div style={{fontWeight:"400", fontSize:"24px"}}>Not sure when it ends...</div>
      </div>
      {is_logged_in?
      <div style={{display:'flex'}}>
        <button id="googleSignOutButton" onClick={signOutHandler}>{google_logo}<span style={{marginLeft:"13px"}}>Sign Out</span></button>
        <button id="gotoMyPageButton" onClick={gotoMyPage}><span style={{marginLeft:"13px"}}>Go to My Page</span></button>
      </div>
      :
      <div>
        <button id="googleButton" onClick={signInGoogle}>{google_logo}<span style={{marginLeft:"13px"}}>Sign in with Google</span></button>
      </div>
      }
    </div>
  )
}

export default Login