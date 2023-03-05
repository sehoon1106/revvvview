import React, { useEffect } from 'react'
import db from './Firebase'
import { ref, set, onValue} from "firebase/database";
import * as config from './config'


const Test2 = () => {

    useEffect(()=>{

        set(ref(db,'/test'), 
            config.test_data
        )
    },[])

    return (
        <div>Test2</div>
    )
}

export default Test2