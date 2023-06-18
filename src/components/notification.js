import { Store } from 'react-notifications-component';
import "./Notification.css"
import "animate.css"

const notify = async (title, message, container="bottom-right") =>{
    await Store.removeAllNotifications()
    
    Store.addNotification({
        content: ()=>(
            <div className='Notification'>
                <div className="NotificationTitle">{title}</div>
                <div className="NotificationMessage">{message}</div>
            </div>
        ),
        insert: "top",
        container: "bottom-right",
        // animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 1000
        }
      });
}

export default notify;