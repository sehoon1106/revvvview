import React from 'react'
import { Store } from 'react-notifications-component';
import "./Notification.css"

const Test4 = () => {
    const notify = (title, message) =>{
        Store.addNotification({
            // title:"sss",
            // message:"ssss",
            // type: "success",
            content: ()=>(
                <div className='Notification'>
                    <div className="NotificationTitle">{title}</div>
                    <div className="NotificationMessage">{message}</div>
                </div>
            ),
            insert: "bottom",
            container: "bottom-right",
            // animationIn: ["animate__animated", "animate__fadeIn"],
            // animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 1300,
            }
          });
    }   
    
    return (     
        <div>
            <button onClick={()=>notify("Title", "message")}>Alert!</button>
        </div>
  )
}

export default Test4