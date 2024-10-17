import React, { useEffect, useState } from 'react';
import './css/HomeCard.css';
import Loader from './Loader';

const HomeCard = ({ service, apply, newUser, isLoader, user }) => {
  const [ans, setAns] = useState(false);

  useEffect(() => {
    if (user && service?.applied) {
      let isApplied = false;
      service.applied.some((e, i) => {
        if (e === user._id) {
          isApplied = true;
          return true; // Break out of the loop when match is found
        }
      });
      setAns(isApplied); // Update the state with the result
    } else {
      setAns(false); // Set to false if there's no user or no applied array
    }
  }, [user, service]); // Re-run effect when user or service changes

  return (
    <>
    
    {isLoader && <Loader/>}
    <section className="homeCard">
      <div className="hcImgCtrl">
        <img src={service.sImg} alt={service.title} />
      </div>
      <div className="hcInfo">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <div className="hcMeta">
          <div className="vacInfo">
            <div className="tVac">Total: {service.tVac}</div>
            <div className="aVac">Applications: {service.applied.length}</div>
          </div>
          <div className="actionBtn" onClick={() => apply(service._id)}>
            {ans ? "Applied" : "Apply"}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HomeCard;
