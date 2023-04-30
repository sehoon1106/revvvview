import React from 'react'

const Test3 = () => {

    const comp = ()=>{
        var albumArr=[]
        var tmp_albumsList=[]
        var tmp = {data:"Hi"}
        albumArr.push(<span onClick={()=> console.log(tmp)}>dsafghjkh</span>)
        tmp_albumsList.push(albumArr)
        return tmp_albumsList
    }
    return (
        <div>{comp()}</div>
    )
}

export default Test3