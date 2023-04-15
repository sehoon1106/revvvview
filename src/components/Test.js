import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Test() {
  const {albumName} = useParams()

  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      const response = await fetch(`https://itunes.apple.com/search?term=${albumName.replaceAll(' ', '+')}&media=music&entity=album&limit=1&lang=ko_KR`);
      var data = await response.json();
      for(var datum of data.results){
        // console.log(datum)
        var tmp = datum.artworkUrl100
        let today = new Date();
        datum['artworkUrlLarge'] = tmp.replace('100x100','100000x10000')
        var tmp_alb={
          [datum.collectionId] : {
            "albumName": datum.collectionName,
            "albumId": datum.albumId,
            "addedDate": (today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()),
            "amgArtistId": datum.amgArtistId,
            "artistName": datum.artistName,
            "artworkLarge": tmp.replace('100x100','100000x10000'),
            "artworkSmall": tmp.replace('100x100','300x300'),
            "genre": datum.primaryGenreName,
            "next": "",
            "prev": "",
            "releaseDate": datum.releaseDate,
            "review": "adasfadfasdfsadffsafasfdasdfasdf",
            "trackCount": datum.trackCount
          }
        };

        console.log("%o",tmp_alb)
      }
      setAlbum(data.results);
    };
    fetchAlbum();
    
  }, []);

  if (!album) {
    return <div>Loading album data...</div>;
  }

  const albums = album.map(album =>(<div>
    
    <h2>{album.collectionName}</h2>
    <h3>{album.artistName}</h3>
    <p>{album.primaryGenreName}</p>
    </div>
  ))

  return (
    <div>
      <h1>Album Data</h1>
      {albums}
    </div>
  );
}

export default Test;