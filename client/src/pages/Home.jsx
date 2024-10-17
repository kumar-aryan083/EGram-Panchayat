import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';
import HomeCard from '../components/HomeCard';
import { applyScheme } from '../utils/useApply';

const Home = ({ user, setMessage, newUser }) => {
  const [isLogin, setLogin] = useState(false);
  const [services, setServices] = useState([]);
  const [info, setInfo] = useState(null);
  const Nav = useNavigate();
  const [announce, setAnnounce] = useState(null);
  const [isLoader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    hfImg: '',
    name: '',
    age: '',
    hfHeading: '',
    hfParagraph: ''
  });
  const getAnnounce = async () => {
    try {
      const res = await fetch('http://192.168.1.9:9000/api/com/get-noti', {
        method: 'GET',
        headers: {
            'Content-Type':'application/json'
        }
      })
      const data = await res.json();
      if(res.ok){
        setAnnounce(data.noti);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong');
    }
  }
  useEffect(() => {
    getAnnounce();
    const getCurrentInfo = async () => {
      const u = await fetch('http://192.168.1.9:9000/api/services/get-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await u.json();
      if (u.ok) {
        setMessage(data.message);
        setFormData({
          hfImg: data.hfImg,
          name: data.name,
          age: data.age,
          hfHeading: data.hfHeading,
          hfParagraph: data.hfParagraph
        })
        console.log(data);
        
      } else {
        console.log('not good')
        setMessage(data.message)
      }
    }
    getCurrentInfo();
  }, [])
  const fetchNewServices = async () => {
    try {
      const res = await fetch('http://192.168.1.9:9000/api/services/new-added', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      setServices(data.services);  // Assuming `data.services` contains the array of services
    } catch (error) {
      console.error('Failed to fetch new services:', error);
    }
  };

  useEffect(() => {
    document.title = 'Home | EGram Panchyat';
    if (!user) {
      setTimeout(() => {
        Nav('/login');
      }, 3000);
    } else {
      setLogin(true);
      fetchNewServices();
    }
  }, [user, newUser]);

  const handleApply = async (id) => {
    setLoader(true);
    const data = await applyScheme(id);
    if (data.services) {
      setServices(data?.services);
      newUser(data.user);
    }
    setMessage(data.message);
    setLoader(false);
  }
  return (
    <>
      {isLogin && (
        <div className="fullHome">
          <div className="firstHome">
            <div className="fhLeft">
              <div className="fhlImgCtrl">
                <div className="hCtrl">
                  <img src={formData.hfImg} alt="" />
                </div>
                <hr />
                <div className="info">
                  <p><strong>Name: </strong>{formData?.name}</p>
                  <p><strong>{formData?.age}</strong></p>
                </div>
              </div>
            </div>
            <div className="fhRight">
              <h1>{formData?.hfHeading}</h1>
              <p>{formData?.hfParagraph}</p>
            </div>
          </div>

          <div className="secondHome">
            <div className="shLeft">
              <h1>Newly Added Schemes</h1>
              <hr />
              <div className="schemeCardHolder">
                {services?.length > 0 ? (
                  services.map((service, index) => (
                    <HomeCard isLoader={isLoader} apply={handleApply} key={index} service={service} newUser={newUser} user={user} />
                  ))
                ) : (
                  <p>No newly added schemes available.</p>
                )}
              </div>
            </div>

            <div className="shRight">
              <h1>Newly Added Announcement</h1>
              <hr />
              <div className="announcementBarHolder">
                {announce?.length > 0 ? (
                  <>
                    {announce?.map((e, i) => (
                      <>
                        <div className="announceBar" key={e._id}>
                          <p>{e.title}</p>
                          {e.tagState && <div className="newBatch">
                            <i className="fa-solid fa-certificate"></i>
                            <p>{e?.tagCont}</p>
                          </div>}
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="announceBar">
                      <p>There is no new Announcement</p>
                      <div className="newBatch">
                        <i className="fa-solid fa-certificate"></i>
                        <p>IMP</p>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {!isLogin && (
        <div className="homeDiv">
          <div className="notLoginCard">
            <p>Please Login first</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
