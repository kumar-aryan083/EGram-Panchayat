import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Profile.css';
import Loader from '../components/Loader';
import { storage } from '../../firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary Firebase functions
import { checkAdmin, checkStalf, checkUser } from '../utils/useCheck';
import Service from '../components/Service';

const Profile = ({
  user,
  setMessage,
  newUser
}) => {
  const Nav = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [currentServiceId, setCurrenctServiceId] = useState(null);
  const [dpUrl, setDpUrl] = useState(""); // State to store uploaded profile picture URL
  const fileInputRef = useRef(null); // Ref to handle file input click programmatically
  const [isAdmin, setAdmin] = useState(false);
  const [isUser, setUser] = useState(false);
  const [isStalf, setStalf] = useState(false);
  const [persons, setPersons] = useState(null);
  const [pos, setPos] = useState('user');
  // State to manage form input, image file, and image URL
  const [form, setForm] = useState({
    title: '',
    description: '',
    tVac: '',
    imageUrl: '' // New field for image URL
  });
  
  const [sId, setSid] = useState('');
  const [image, setImage] = useState(null); // State to hold the image file

  const authAdmin = async () => {
    const ans = await checkAdmin();
    if(ans) {
      setPos('admin');
    }
    setAdmin(ans);
  }
  const authUser = async () => {
    const ans = await checkUser();
    if(ans) {
      setPos('user');
    }
    setUser(ans);
  }
  const authStalf = async () => {
    const ans = await checkStalf();
    if(ans) {
      setPos('stalf');
    }
    setStalf(ans);
  }

  useEffect(() => {
    authAdmin();
    authStalf();
    authUser();
    console.log("user"+isUser+", admin"+isAdmin+", stalf"+isStalf)
    document.title = `${user?.name} | Profile`;
    if (!user) {
      Nav('/');
    }
  }, [user, Nav]);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Handle image change and validate file type
  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const input = e.target; // Store reference to the input element

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      setImage(file); // Set the selected image file if it's a valid type

      const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Create a unique name
      const storageRef = ref(storage, `ProfilePic/${timestamp}_${file.name}`); // Reference for storage
      const snapshot = await uploadBytes(storageRef, file); // Upload the file
      const downloadUrl = await getDownloadURL(snapshot.ref); // Get the file URL

      setDpUrl(downloadUrl); // Set the image URL
      console.log('Profile Picture URL:', downloadUrl); // Log the URL

      input.value = ""; // Clear the file input after upload
    } else {
      setMessage('Only .jpg, .png, or .webp files are allowed.'); // Set validation message
      setImage(null); // Clear the selected image
      input.value = ""; // Clear the file input in case of invalid file
    }
  };

  const handleDpChange = (e) => {
    console.log('hit');
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      setImage(file); // Set the selected image file if it's a valid type
      handleDpUpload(file); // Automatically call handleDpUpload with the selected file
    } else {
      setMessage('Only .jpg, .png, or .webp files are allowed.');
      setImage(null); // Clear the image if invalid
    }
  };

  // Function to handle the profile picture upload
  const handleDpUpload = async (file) => {
    if (!file) {
      setMessage('Please select a valid image.');
      return;
    }

    setLoading(true);
    try {
      // Create a unique name for the file using the current date
      const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove unwanted characters
      const storageRef = ref(storage, `ProfilePic/${timestamp}_${file.name}`); // Unique name for the file
      const snapshot = await uploadBytes(storageRef, file); // Upload the image
      const downloadUrl = await getDownloadURL(snapshot.ref); // Get the image URL
      setDpUrl(downloadUrl); // Store the image URL in state
      console.log('Profile Picture URL:', downloadUrl); // Print URL to console
      const res = await fetch(`http://192.168.1.9:9000/api/${pos}/update-profile-pic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dpImg: downloadUrl }),
        credentials: 'include'
      });
      const data = await res.json();
      newUser(data.user);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setMessage('Profile picture upload failed.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = form.imageUrl; // To store the image URL after upload

    // If an image is selected, upload it to Firebase storage
    if (image) {
      try {
        // Create a unique name for the file using the current date
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove unwanted characters
        const storageRef = ref(storage, `schemes/${timestamp}_${image.name}`); // Unique name for the file
        const snapshot = await uploadBytes(storageRef, image); // Upload the image
        imageUrl = await getDownloadURL(snapshot.ref); // Get the image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage('Image upload failed.');
        setLoading(false);
        return;
      }
    }

    // Submit the form data with imageUrl included
    const res = await fetch('http://192.168.1.9:9000/api/admin/add-service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...form, sImg: imageUrl }), // Include the image URL in the form data
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setForm({
        title: '',
        description: '',
        vac: '',
        imageUrl: '' // Clear the image URL after successful submission
      });
      document.querySelector('.profileDp').style.display = 'none';
      document.querySelector('.profileServices').style.zIndex = '0'
      if (data.user) {
        newUser(data.user);
      }
    } else {
      setMessage(data.message);
    }
    setLoading(false);
  };

  const handleShowPop = () => {
    const pop = document.querySelector('.profileDp');
    const cards = document.querySelector('.profileServices');
    if (pop.style.display === 'none') {
      pop.style.display = 'flex';
      cards.style.zIndex = '-1'
    } else {
      pop.style.display = 'none';
    }
  };
  const editScheme = (data) => {
    document.querySelector('.profileDp1').style.display = 'flex'
    document.querySelector('.profileServices').style.zIndex = '-1'
    setForm({
      title: data.title,
      description: data.description,
      tVac: data.tVac,
      imageUrl: data.sImg
    });
    setSid(data._id);
  }
  const updateEdited = async (e) => {

    e.preventDefault();
    setLoading(true);

    let imageUrl = form.imageUrl; // To store the image URL after upload

    // If an image is selected, upload it to Firebase storage
    if (image) {
      try {
        // Create a unique name for the file using the current date
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove unwanted characters
        const storageRef = ref(storage, `schemes/${timestamp}_${image.name}`); // Unique name for the file
        const snapshot = await uploadBytes(storageRef, image); // Upload the image
        imageUrl = await getDownloadURL(snapshot.ref); // Get the image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage('Image upload failed.');
        setLoading(false);
        return;
      }
    }

    // Submit the form data with imageUrl included
    const res = await fetch('http://192.168.1.9:9000/api/admin/update-service', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...form, sImg: imageUrl, id: sId }), // Include the image URL in the form data
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setForm({
        title: '',
        description: '',
        vac: '',
        imageUrl: ''
      });
      document.querySelector('.profileDp1').style.display = 'none';
      document.querySelector('.profileServices').style.zIndex = '0'
      if (data.user) {
        newUser(data.user);
      }
    } else {
      setMessage(data.message);
    }
    setLoading(false);
  }
  // Handle triggering the file input for profile picture change
  const handleEditDpClick = () => {
    fileInputRef.current.click(); // Trigger file input when editDp is clicked
  };
  const showPersonsApplied = async (serviceId) => {
    console.log('hit')
    document.querySelector('.personPopUp').style.display = 'flex'
    setLoading(true);
      const res = await fetch('http://192.168.1.9:9000/api/admin/all-applications', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({id:serviceId}),
        credentials: 'include'
      })
      const data = await res.json();
      if(res.ok){
        setCurrenctServiceId(serviceId);
        setPersons(data.persons);
        setMessage(data.message);
      }
      setLoading(false);
  }
  const handleDashboard = () => {
    if(isAdmin) {
      Nav('/dashboard');
    } else{
      Nav('/');
    }
  }
  const handleApprove = async (userId, serviceId) => {
    console.log(serviceId);
    try {
      const res = await fetch(`http://192.168.1.9:9000/api/com/approve/${serviceId}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json'
        },
        credentials: 'include'
      })
      const data = await res.json();
      if(res.ok){
        setMessage(data.message);
      } else{
        setMessage("Backend me chodi ho gya hai")
      }
    } catch (error) {
      console.log('Frontend me chodi ho gya hai')
    }
  }
  const handleReject = async (userId, serviceId) => {
    console.log(serviceId);
    try {
      const res = await fetch(`http://192.168.1.9:9000/api/com/reject/${serviceId}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json'
        },
        credentials: 'include'
      })
      const data = await res.json();
      if(res.ok){
        setMessage(data.message);
      } else{
        setMessage("Backend me chodi ho gya hai")
      }
    } catch (error) {
      console.log('Frontend me chodi ho gya hai')
    }
  }
  return (
    <>
      {isLoading && <Loader />}
      <div className="fullProfilePage">
        <div className="profileCard">
          <div className="pcLeft">
            <div className="dpImgCtrl">
              <img src={user?.dpImg} alt="" />
              <div className="editDp" onClick={handleEditDpClick}>
                <i className="fa-solid fa-pen"></i>
              </div>
            </div>
            <div className="dpInfo">
              <h3>Name: {user?.name}</h3>
              {isAdmin && <p>Position: Admin</p>}
              {isUser && <p>Position: User</p>}
              {isStalf && <p>Position: Stalf</p>}
            </div>
          </div>
          <div className="pcMid">
            <p>Email: {user?.email}</p>
            {isAdmin && <p>Total Schemes Created: {user?.cServices?.length}</p>}
            {isUser && <p>Total Schemes Applied: {user?.appliedServices?.length}</p>}
          </div>
          {isAdmin && <div className="pcRight">
            <div className="pBtns">
              <div className="addBtn" onClick={handleShowPop}>Add New Scheme</div>
            </div>
            <div className="pBtns bgGreen">
              <div className="dashBtn" onClick={handleDashboard}>Dashboard</div>
            </div>
          </div>}
        </div>
        {isAdmin && <div className="profileDp">
          <div className="popUpCard">
            <h1>Create New Scheme</h1>
            <hr />
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder='Enter the title' name='title' onChange={handleChange} value={form.title} required />
              <input type="text" placeholder='Enter the description' name='description' onChange={handleChange} value={form.description} required />
              <input type="number" placeholder='Enter the number of Vacancies' name='tVac' onChange={handleChange} value={form.tVac} required />

              {/* Image Upload Input */}
              <input type="file" accept="image/*" onChange={handleImageChange} />

              <input type="submit" value="Submit" />
            </form>
            <div className="close" onClick={() => {
              document.querySelector('.profileDp').style.display = 'none'
              document.querySelector('.profileServices').style.zIndex = '0'
            }}>Close</div>
          </div>
        </div>}
        {isAdmin && <div className="profileDp1">
          <div className="popUpCard">
            <h1>Update Scheme</h1>
            <hr />
            <form onSubmit={updateEdited}>
              <input type="text" placeholder='Enter the title' name='title' onChange={handleChange} value={form.title} required />
              <input type="text" placeholder='Enter the description' name='description' onChange={handleChange} value={form.description} required />
              <input type="number" placeholder='Enter the number of Vacancies' name='tVac' onChange={handleChange} value={form.tVac} required />

              {/* Image Upload Input */}
              <input type="file" accept="image/*" onChange={handleImageChange} />

              <input type="submit" value="Submit" />
            </form>
            <div className="close" onClick={() => {
              document.querySelector('.profileDp1').style.display = 'none'
              document.querySelector('.profileServices').style.zIndex = '0'
              setForm({
                title: '',
                description: '',
                tVac: '',
                imageUrl: ''
              })
            }}>Close</div>
          </div>
        </div>}
      </div>




      {isAdmin && <div className="profileServices">
        <div className="psLeft">
          <Service showPersonsApplied = {showPersonsApplied} isAdmin={isAdmin} setMessage={setMessage} editScheme={editScheme} newUser={newUser} user={user} work='Created Services' />
        </div>
        <div className="psRight">
          <Service showPersonsApplied = {showPersonsApplied} isAdmin={isAdmin} setMessage={setMessage} editScheme={editScheme} newUser={newUser} user={user} work='Updated Services' />
        </div>
      </div>}

      {isUser && <div className="profileServices">
        <div className="psLeft">
          <Service showPersonsApplied = {showPersonsApplied} isAdmin={isAdmin} setMessage={setMessage} editScheme={editScheme} newUser={newUser} user={user} work='Pending Applied Services' />
        </div>
        <div className="psRight">
          <Service showPersonsApplied = {showPersonsApplied} isAdmin={isAdmin} setMessage={setMessage} editScheme={editScheme} newUser={newUser} user={user} work='Approved Applied Services' />
        </div>
      </div>}


      {/* Hidden file input for profile picture change */}
      <div className="dpForm">
        <form>
          <input
            type="file"
            accept=".jpg, .png, .webp"
            ref={fileInputRef}
            onChange={handleDpChange}
            style={{ display: 'none' }} // Hide the input
          />
        </form>
      </div>

      {isAdmin && (
  <div className="personPopUp" style={{ display: 'none' }}>
    <div className="personInfoTable">
      <div 
        className="close" 
        onClick={() => {
          document.querySelector('.personPopUp').style.display = 'none';
        }}
      >
        Close
      </div>
      <h3>Persons Applied for Service</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date Applied</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {persons?.length > 0 ? (
            persons.map((person) => (
              <tr key={person._id}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{new Date(person.createdAt).toLocaleDateString()}</td>
                <td className='aBtns'>
                  <div className="perBtns" onClick={() => {handleApprove(person._id, currentServiceId)}}>Approve</div>
                  <div className="aBtn" onClick={() => {handleReject(person._id, currentServiceId)}}>Reject</div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No persons have applied for this service yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

    </>
  );
};

export default Profile;
