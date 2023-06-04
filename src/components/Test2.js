import React, { useEffect } from 'react'
import db from './Firebase'
import { ref, set} from "firebase/database";
import * as config from './config'


const Test2 = () => {

    useEffect(()=>{

        set(ref(db,'/testee'), 
            config.test_data.testee
        )
    },[])

    return (
        <div>Test2</div>
    )
}

export default Test2