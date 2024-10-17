import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import Contact from './pages/Contact';
import About from './pages/About';
import Logout from './pages/Logout';
import Footer from './components/Footer';
import Profile from './pages/Profile';

const App = () => {
  const [popMsg, setPopMsg] = useState('');
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null
  })
  const [isMsg, setMsg] = useState('');
  const setPoping = (e) => {
    setPopMsg(e);
    const popUp = document.querySelector('.dhPop');
    popUp.style.display = 'flex'
  }
  const closePop = () => {
    const popUp = document.querySelector('.dhPop');
    popUp.style.display = 'none'
  }
  const newUser = (u) => {
    try {
      if (u !== null) {
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      } else {
        setUser(u);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: '500 internal server error'
      })
    }
  }
  const setMessage = (message) => {
    setMsg(message);
    setTimeout(() => {
      setMsg('');
    }, 2000);
  }
  return (
    <>
      <div className="bgImg">
        <img src="https://assets.gqindia.com/photos/662f65c0a9ec22e5b59e7f18/master/pass/Panchayat-release-date.jpg" alt="" />
      </div>
      <Navbar user={user} message={isMsg} newUser={newUser} />
      <div className="fullBody">
        <Routes>
          <Route path='/' element={<Home newUser={newUser} user={user} setMessage={setMessage} />} />
          <Route path='/login' element={<Login pos='user' setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/profile' element={<Profile setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/dashboard' element={<Dashboard setPoping = {setPoping} setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/admin/login' element={<Login pos='admin' setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/stalf/login' element={<Login pos='stalf' setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/register' element={<Register pos='user' setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/admin/register' element={<Register pos='admin' setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/stalf/register' element={<Register pos='stalf' setMessage={setMessage} newUser={newUser} user={user} />} />
          <Route path='/dashboard' element={<Dashboard setMessage={setMessage} user={user} />} />
          <Route path='/contact-us' element={<Contact user={user} />} />
          <Route path='/about-us' element={<About user={user} />} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
      </div>
      <Footer />
      <div className="dhPop">
        <div className="dhPopCard">
          <p>{popMsg}</p>
          <div className="dhPopClose" onClick={closePop}>Close</div>
        </div>
      </div>
    </>
  )
}

export default App