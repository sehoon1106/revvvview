import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, getRedirectResult, setPersistence, signInWithRedirect, signOut, browserLocalPersistence, getAdditionalUserInfo } from "firebase/auth";

import db from './Firebase'
import { ref, set} from "firebase/database";

function Test3() {
  const [loginInfo, setLoginInfo] = useState({});
  const [id, setId] = useState("")
  const [pw, setPW] = useState("")
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result === null) return;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        setLoginInfo({
          credential: credential,
          token: credential.accessToken,
          user: result.user,
        });

        const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

        if(isNewUser){
            set(ref(db, `/${result.user.uid}/`),
                {
                    albums:{"0000":{id:"head", name:"Best", next:"", prev:""},head:"0000"},
                    nickname: result.user.displayName
                }
            )
        }

        console.log((result))
        console.log(getAdditionalUserInfo(result))
        console.log(result.additionalUserInfo.isNewUser)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Run once when component mounts

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoginInfo({
          user: user,
        });
      } else {
        setLoginInfo({});
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = () =>{
    return;
  }

  const signInGoogle = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithRedirect(auth, provider);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signOutHandler = async () => {
    await signOut(auth)
      .then(() => {
        setLoginInfo({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const typeId = (e) => {
    setId(e.target.value)
  }
  const typePW = (e) => {
    setPW(e.target.value)
  }

  return (
    <div>
      {loginInfo.user ? (
        <div>
          <button onClick={signOutHandler} style={{color:"white"}}>Sign Out</button>
          <div>Logged In</div>
        </div>
      ) : (
        <div>
          <div><input onChange={typeId} value={id}></input></div>
          <div><input onChange={typePW} value={pw}></input></div>
          <button onClick={signIn} style={{color:"white"}}>Sign in</button>
          <button onClick={signInGoogle} style={{color:"white"}}>Google</button>
        </div>
      )}
    </div>
  );
}

export default Test3;