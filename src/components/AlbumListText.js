import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import './AlbumList.css'

import db from './Firebase'
import { ref, set} from "firebase/database";

import notify from './notification';
import html2canvas from 'html2canvas';
import ScreenshotModal from './ScreenshotModal';
import { GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence, signInWithRedirect, signOut } from 'firebase/auth';


const AlbumListText = ({id, hoveredAlbum, setHoveredAlbum, albumsList, setAlbumsList, name, is_owner, pageRef}) => {
    // const album = config.test_data.sehoon1106.albums;   

    var dragging = ""
    const [draggingHook, setDraggingHook] = useState("");
    const [screenshot, setScreenshot] = useState(null);    
    const [modal, setModal] = useState(-1);
    const [is_logged_in, setLoggedIn] = useState(false)

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

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
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async(user) => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        });
    
        return () => {
          unsubscribe();
        };
    }, []);

    const changeHoveredAlbum = (event) =>{
        setHoveredAlbum(event.target.id)
    }
    const resetHoveredAlbum = () => {
        setHoveredAlbum("")
    }

    //check if the target is before(returns 0) or after(returns 1) dragging
    const check_order = (dragging, target) =>{
        var tmp=albumsList[dragging].prev;
        while(tmp.length>=1){
            if(tmp===target) return 0;
            tmp=albumsList[tmp].prev
        }
        return 1;
    }

    const insert_album = (dragging, target) => {
        if(dragging===target) return;
        
        var tmp_list = {...albumsList}

        const connect_data = (datum_addr, target, direction) => {
            if((tmp_list[datum_addr]===null)||(tmp_list[datum_addr]===undefined)) return;

            // 1 datum -> target
            if(direction===1){
                tmp_list[datum_addr].next = target
            }
            // 0 target <- datum
            else{
                tmp_list[datum_addr].prev = target;
            }

        }

        const target_prev = tmp_list[target].prev
        const target_next = tmp_list[target].next

        if(!check_order(dragging,target)){
            connect_data(tmp_list[dragging].prev, tmp_list[dragging].next,1)
            connect_data(tmp_list[dragging].next, tmp_list[dragging].prev,0)
    
    
            connect_data(target_prev, dragging, 1)
            connect_data(dragging, target_prev, 0)
            connect_data(dragging, target, 1)
            connect_data(target, dragging, 0)
    
            // console.log()
    
            setAlbumsList(tmp_list)
        }
        else{
            connect_data(tmp_list[dragging].prev, tmp_list[dragging].next,1)
            connect_data(tmp_list[dragging].next, tmp_list[dragging].prev,0)
    
            connect_data(target, dragging, 1)
            connect_data(dragging, target, 0)
            connect_data(dragging, target_next, 1)
            connect_data(target_next, dragging, 0)
    
            // console.log()
    
            setAlbumsList(tmp_list)
        }
    }

    const enter_album = (dragging, target)=>{
        var tmp = dragging;
        if(tmp.length<1) tmp = draggingHook
        // console.log(`dragging: ${tmp} target: ${target}`)

        insert_album(tmp,target)
    }

    const captureScreenshot = () => {
        html2canvas(pageRef.current, {allowTaint:true, useCORS:true}).then((canvas) => {
            setScreenshot(canvas)
            setModal(1)
        });
      };
    
    const generateAlbumsList = (album) => {
        var tmp_albumsList=[<div className="userNameHolder">
                                {is_logged_in?<div id='LogInText'onClick={signOutHandler}>Log Out</div>:<div id='LogInText'onClick={signInGoogle}>Log In</div>}
                            </div>];
        // const album = config.test_data.sehoon1106.albums;
        let tmp = album[album.head];
        let albumArr = [];
        let count = 0;
        var is_first = true;

        const camera_icon = <svg id="camera" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="inherit" d="M20 4h-3.17L15 2H9L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12M12 7a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3Z"/></svg>
        
        while (tmp) {
            if (!tmp.artistName) {
                if (count > 0) {
                    for(count; count<5; count++){
                        albumArr.push(<div key={"albumNamebox "+tmp.name+count} className="albumNameBox"></div>)
                    }
                    tmp_albumsList.push(<span key={"album_text_box "+tmp.name} className="album_text_box">{albumArr}</span>);
                    albumArr = [];
                }
                if(is_first){
                    tmp_albumsList.push(
                        <span key={"grade_box "+tmp.name} className="grade_box_initial" onClick={captureScreenshot}>
                            <span className='IconBox'>{camera_icon}</span>
                        </span>
                    );
                    is_first=false;
                }
                else{
                    tmp_albumsList.push(<span key={"divide_line "+tmp.name} className="divide_line"></span>);
                    tmp_albumsList.push(<span key={"grade_box "+tmp.name} className="grade_box"></span>);
                }
                count = 0;
                tmp = album[tmp.next];
            } else {
                if (count === 0) {
                    albumArr = [];
                }
                if (tmp.artistName) {
                    albumArr.push(
                        <Link to={`/${id}/${tmp.id}`}>
                        <div 
                        key={"albumNameBox "+tmp.name}
                        id={tmp.id}
                        className={"albumNameBox albumName"}
                        onMouseEnter={changeHoveredAlbum}
                        onMouseOut={resetHoveredAlbum}
                        draggable={is_owner?'true':'false'}
                        onDragStart={(event)=>{
                            dragging = event.target.id
                            setDraggingHook(dragging)
                        }}
                        onDragOver = {(e)=>{e.preventDefault()}}
                        onDragEnter = {(e)=>{
                            e.preventDefault()
                            enter_album(dragging, e.target.getAttribute("id"))
                        }}
                        onDrop = {async (e)=>{
                            setDraggingHook("");
                            await set(ref(db, `/${id}/albums`),
                                albumsList
                            )
                            .then(notify("Auto Saved", "Automatically saved the list."))
                        }}
                        style={{
                            // outline: tmp.id===hoveredAlbum?'2px solid white' : 'none',
                            background: tmp.id===hoveredAlbum?'#FFFFFF' : 'none',
                            borderRadius: tmp.id===hoveredAlbum?'6px' : 'none',
                            color: tmp.id===hoveredAlbum?'black' : 'white',
                            cursor: tmp.id===hoveredAlbum?'pointer' : 'none'
                        }}
                        >
                                {tmp.name}
                        </div>
                        </Link>
                    );
                    count++;
                }
                if (count === 5) {
                    albumArr = <span key={"album_box "+tmp.name} className="album_text_box">{albumArr}</span>;
                    tmp_albumsList.push(albumArr);
                    count = 0;
                }
                tmp = album[tmp.next];
            }
        }

        if (count > 0) {
            for(count; count<5; count++){
                albumArr.push(<div key={"album_box last " + count} className="albumNameBox"></div>)
            }
            albumArr = <span key={"album_text_box last"} className="album_text_box">{albumArr}</span>;
            tmp_albumsList.push(albumArr);
        }
        return tmp_albumsList
    }
    
    
    return (
        <div style={{textAlign:"left"}}>
            {modal===1 && <div className='overlay'/>}
            {modal===1 && <ScreenshotModal setModal={setModal} name={name} image={screenshot}/>}
            {generateAlbumsList(albumsList)}
        </div>
    );
}

export default AlbumListText


