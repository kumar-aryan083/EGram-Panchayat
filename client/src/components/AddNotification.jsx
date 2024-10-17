import React, { useState } from 'react';
import './css/AddNotification.css';

const AddNotification = ({ setMessage }) => {
  const [trueAdd, setTrueAdd] = useState(false);
  const [noti, setNoti] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    settingUp: 'no',
    subject: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://192.168.1.9:9000/api/com/save-noti', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      })
      const data = await res.json();
      if(res.ok){
        setMessage(data.message);
      }
    } catch (error) {
      console.log(12);
    }
  };

  const handleSettingChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      settingUp: value,
      subject: value === 'yes' ? formData.subject : '' // Reset subject if 'no' is selected
    });
    setTrueAdd(value === 'yes');
  };

  return (
    <>
      <div className="fullAddNotifi">
        <h1>Add New Notification</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter the title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Enter the description"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
          />
          <div className="inpt">
            <label htmlFor="label">Add Label</label>
            <select name="settingUp" id="label" value={formData.settingUp} onChange={handleSettingChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {trueAdd && (
            <select name="subject" value={formData.subject} onChange={handleChange}>
              <option value="">Choose One</option>
              <option value="NEW">New</option>
              <option value="IMP">Important</option>
            </select>
          )}
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default AddNotification;
