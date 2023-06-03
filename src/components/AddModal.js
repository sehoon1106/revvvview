import React, { useRef, useState } from 'react'
import './AddModal.css'
import { push, ref, set} from "firebase/database";
import db from './Firebase'

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


const AddModal = ({setModal, id, prev, next, albumList}) => {
    const [addMode, setAddMode] = useState(0) // 0 for album, 1 for grade
    const [type, setType] = useState('')
    const [review, setReview] = useState('')
    const [focus, setFocus] = useState(false)
    const [searchResult, setSearchResult] = useState([])
    const [inputAlbum, setInputAlbum] = useState({})
    const [typingTimer, settypingTimer] = useState(null)


    const textareaRef = useRef(null);

    const typing = (e) =>{
        if(addMode===0){
            search_album();
        }
        setType(e.target.value);
    }
    const type_review = (e) => {
        setReview(e.target.value)
    }
    const handleTextareaResize = () => {
        textareaRef.current.style.height = "auto"; // Reset height to auto to calculate actual height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to actual height
    };

    const change_date_format= (date) => {
        if(date===null || date===undefined) return;
        var releaseDate = new Date(date)
        return `${releaseDate.getFullYear()}/${releaseDate.getMonth()}/${releaseDate.getDate()}`
    }

    const close_modal = () =>{
        setModal(-1)
    }
    
    const add_album = async () => {
        var added_albumList = {...albumList}
        var input_data;
        var addr;

        if(addMode===0){
            if(inputAlbum.name===null || inputAlbum.name===undefined) return;
            input_data={
                ...inputAlbum,
                next: `${next}`,
                prev:`${prev}`,
                id:`${inputAlbum.id}`,
                review:`${review}`
            }
            addr=inputAlbum.id
        }
        else if(addMode===1){
            addr = push(ref(db, `/${id}/albums/`)).key
            if(type.length<1) return;
            input_data = {
                name: `${type}`,
                id:`${addr}`,
                next: `${next}`,
                prev: `${prev}`,
            }
        }
        await set(ref(db, `/${id}/albums/${addr}`), input_data)
        if(prev.length>=1)
            await set(ref(db, `/${id}/albums/${prev}/next`),addr)
        if(next.length>=1)
            await set(ref(db, `/${id}/albums/${next}/prev`),addr)

        setModal(-1)
    }
    
    const search_album = () =>{
        clearTimeout(typingTimer)

        const tmp = setTimeout(async () => {
            var data;
            try{
                const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(type)}&media=music&entity=album&limit=10&lang=ko_KR`);
                data = await response.json();
                data = data.results
                var today= new Date();
                data.map((album,index)=>{
                    var tmp = album.artworkUrl100
                    data[index] = {
                        "name": album.collectionName,
                        "id": album.collectionId,
                        "addedDate": (today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()),
                        "artistId": album.artistId,
                        "artistName": album.artistName,
                        "artworkLarge": tmp.replace('100x100','100000x10000'),
                        "artworkSmall": tmp.replace('100x100','300x300'),
                        "genre": album.primaryGenreName,
                        "next": "",
                        "prev": "",
                        "releaseDate": album.releaseDate,
                        "review": "",
                        "trackCount": album.trackCount
                    }
                })
                setSearchResult(data)
            } catch(error){
                console.error('Failed to Fetch from itunes:', error);
            }
        }, 500)
        settypingTimer(tmp)
    }


    return (
        <div className="AddModal">
            {/* <div>{prev} {next}</div> */}
            <div className='ModeButtonBox'>
                <button
                    onClick={()=>{setAddMode(0)}}
                    className='ModeButtonInner'
                    style={{color:(addMode==0?'white':'#999999')}}
                    >
                    Album
                </button>
                <span style={{marginInline:"2px", height:"24px", borderLeft:"1px white solid"}} />
                <button 
                    onClick={()=>{setAddMode(1)}} 
                    className='ModeButtonInner'
                    style={{color:(addMode==1?'white':'#999999')}}
                    >
                    Grade
                </button>
            </div>
            
            {addMode===0 &&
                <div>
                    <div className="centerDiv">
                        <input  value={type} onChange={typing} className="AddModalInput"
                        onFocus={()=>{setFocus(true)}}
                        placeholder="Search Album, Artist, etc."></input>
                        {type.length>=1 && focus &&
                            <div className="searchResultBox" onClick={()=>{setFocus(false)}}>
                            {searchResult.map((album, index) => {
                                return(
                                    <div className="searchResultInd" id={index} 
                                    onClick={()=>{
                                        setInputAlbum(searchResult[index])
                                        setFocus(false)
                                    }}
                                    >
                                        <span><img src={album.artworkSmall} className="searchArtwork"></img></span>
                                        <span>
                                            <div className="searchAlbumTitle">{album.name}</div>
                                            <div className="searchAlbumArtist">{album.artistName}</div>
                                        </span>
                                    </div>
                                )
                            })}
                            </div>
                        }
                    </div>
                    <div style={{display:"flex", alignItems:"center"}}>
                        <span className="albumArt" style={{outline:`${inputAlbum.name?'none':'1px white solid'}`}}>
                            <img src={inputAlbum.artworkSmall} style={{width:'100%'}}></img>
                        </span>
                        <span style={{width:'270px'}}>
                            <div className="AlbumTitleModal">{inputAlbum.name}</div>
                            <div className='AlbumAttributeBoxModal'>
                                <span className="AlbumAttributeNameModal">Artist</span>
                                <span className='AlbumAttributeDataModal'>{inputAlbum.artistName}</span>
                            </div>
                            <div className='AlbumAttributeBoxModal'>
                                <span className="AlbumAttributeNameModal">Released</span>
                                <span className='AlbumAttributeDataModal'>{change_date_format(inputAlbum.releaseDate)}</span>
                            </div>
                            <div className='AlbumAttributeBoxModal'>
                                <span className="AlbumAttributeNameModal">Genre</span>
                                <span className='AlbumAttributeDataModal'>{inputAlbum.genre}</span>
                            </div>
                            <div className='AlbumAttributeBoxModal'>
                                <span className="AlbumAttributeNameModal">Tracks</span>
                                <span className='AlbumAttributeDataModal'>{inputAlbum.trackCount}</span>
                            </div>
                        </span>
                    </div>
                    {HorizonLine}
                    <div className='centerDiv'>
                    <textarea
                        ref={textareaRef}
                        className="AlbumReviewBoxModal"
                        placeholder='No Review Written'
                        value={review}
                        onChange={type_review}
                        onInput={handleTextareaResize}
                        wrap="soft"
                    ></textarea>
                    </div>
                </div>
            }

            {addMode===1 &&
                <div className="centerDiv">
                    <input  value={type} onChange={typing}
                    placeholder='Grade should be more than 1 letter' className='gradeNameInput'></input>
                </div>
            }

            <div className='buttonBox'>
                <button className="cancleButton" onClick={close_modal}>Cancle</button>
                <button className="doneButton" onClick={add_album}>Add</button>
            </div>
        </div>
    )
}

export default AddModal