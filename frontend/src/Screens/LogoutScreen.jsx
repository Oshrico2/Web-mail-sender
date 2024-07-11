import React, { useEffect } from 'react'
import {toast,ToastContainer} from 'react-toastify'

const LogoutScreen = () => {
    useEffect( () => {
        localStorage.clear();
        toast.success('התנתקת בהצלחה!');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    },[])
  return (
    <div>
    <ToastContainer rtl={true} />
    </div>
  )
}

export default LogoutScreen