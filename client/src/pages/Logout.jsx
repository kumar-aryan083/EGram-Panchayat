import React, { useEffect } from 'react'
import './css/Logout.css'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const Nav = useNavigate();
    useEffect(() => {
        document.title = 'Logout | EGram Panchyat'
        setTimeout(() => {
            Nav('/');
        }, 3000);
    }, [])
  return (
    <>
        <div className="fullLogout">
            <div className="textCover">
                <div className="iconWrapper">
                <i className="fa-solid fa-check"></i>
                </div>
                <h1>Hope To See You Soon...</h1>
            </div>
        </div>
    </>
  )
}

export default Logout