import React from 'react'
import * as config from './config'

const Single_album = () => {
    const album = config.test_data.sehoon1106.albums[config.test_data.sehoon1106.albums.head]
    console.log(album)
    return (
        <div>
            <img src={album.artworkSmall} alt={album.albumName} width='200'/>
        </div>
    )
}

export default Single_album