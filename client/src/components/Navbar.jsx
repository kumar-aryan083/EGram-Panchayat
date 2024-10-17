import React, { useEffect } from 'react'
import './css/Navbar.css'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = ({
    user,
    message,
    newUser
}) => {
    useEffect(() => {
        if (message !== '') {
            const notify = () => toast(message);
            notify();
        }
    }, [message])
    const handleBgr = () => {
        const rNav = document.querySelector('.rightNav');
        if (rNav.style.left === '-100%') {
            rNav.style.left = '-15px'
        } else {
            rNav.style.left = '-100%';
        }
    }
    const handleClose = () => {
        document.querySelector('.rightNav').style.left = '-100%'
    }
    const handleLogout = () => {
        localStorage.removeItem('user');
        newUser(null);
    }
    return (
        <>
            <section className="navWapper">

                <section className="navbar">
                    <div className="leftNav">
                        <h1>Gram Panchayat</h1>
                    </div>
                    <div className="rightNav">
                        <ul className="navList">
                            <Link to='/' onClick={handleClose}><li className="listItems">Home</li></Link>
                            <Link to='/new-scheme' onClick={handleClose}><li className="listItems">New Schemes</li></Link>
                            <Link to='/contact-us' onClick={handleClose}><li className="listItems">Contact Us</li></Link>
                            <Link to='/about-us' onClick={handleClose}><li className="listItems">About Us</li></Link>
                        </ul>
                        {!user && <div className="btns">
                            <Link to='/login' onClick={handleClose}><div className="lBtn">Login</div></Link>
                            <Link to='/register' onClick={handleClose}><div className="rBtn">Register</div></Link>
                        </div>}
                        {user && <div className="btns">
                            <Link to='/profile' onClick={handleClose}><div className="pBtn">Profile</div></Link>
                            <Link to='/logout' onClick={handleClose}><div className="loBtn" onClick={handleLogout}>Logout</div></Link>
                        </div>}
                    </div>
                    <div className="bgr" onClick={handleBgr}>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                </section>
            </section>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition:Bounce
            />
        </>
    )
}

export default Navbar