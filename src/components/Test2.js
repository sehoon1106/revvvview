import React, { useEffect } from 'react'
import db from './Firebase'
import { ref, set, onValue} from "firebase/database";
import * as config from './config'


const Test2 = () => {

    useEffect(()=>{

        set(ref(db,'/sehoon1106'), 
            config.test_data.sehoon1106
        )
    },[])

    return (
        <div>Test2</div>
    )
}

export default Test2