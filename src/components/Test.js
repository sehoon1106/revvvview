import React, { useState, useEffect } from 'react';

function Test() {
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      const response = await fetch('https://itunes.apple.com/search?term=sos+sza&media=music&lang=ko_KR');
      var data = await response.json();
      for(var datum of data.results){
        console.log(datum)
        var tmp = datum.artworkUrl100
        datum['artworkUrlLarge'] = tmp.replace('100x100','100000x10000')
      }
      setAlbum(data.results);
    };
    fetchAlbum();
    
  }, []);

  if (!album) {
    return <div>Loading album data...</div>;
  }

  const albums = album.map(album =>(<div>
    <img src={album.artworkUrlLarge} alt={album.collectionName} width='100'/>
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