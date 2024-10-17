import React, { useEffect, useState } from 'react';
import './css/Contact.css';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact Us | EGram Panchyat'
  }, [])
  // Initialize state to store form data
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    subject: 'Not able to apply', // Default option value
    address: '',
    message: ''
  });

  // Handle change function to update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Handle submit function to print form data in console
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // Print the entire form data
  };

  return (
    <>
      <div className="fullContact">
        <div className="leftContact">
          <h3>Before Contacting Read this:</h3>
          <hr />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias ratione debitis...</p>
          <ul>
            <li>Lorem ipsum dolor sit amet consectetur adipisicing.</li>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</li>
          </ul>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste ipsam, nobis cupiditate...</p>
        </div>
        <div className="rightContact">
          <h1>Contact Us</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="number"
              placeholder="Enter your Number"
              value={form.number}
              onChange={handleChange}
              required
            />
            <select name="subject" value={form.subject} onChange={handleChange}>
              <option value="Not able to apply">Unable to apply</option>
              <option value="Pending for Long time">Pending for Long time</option>
              <option value="Approved but not got the service">
                Not got the service after approval
              </option>
            </select>
            <textarea
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Enter your message"
              value={form.message}
              onChange={handleChange}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
