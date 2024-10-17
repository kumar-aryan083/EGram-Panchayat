import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage imports
import './css/EditInfo.css';

const EditInfo = ({ user, setMessage }) => {
    const [isLoader, setLoader] = useState(false)
    const [formData, setFormData] = useState({
        hfImg: '',
        name: '',
        age: '',
        hfHeading: '',
        hfParagraph: ''
    });
    useEffect(() => {
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
            } else {
                console.log('not good')
                setMessage(data.message)
            }
        }
        getCurrentInfo();
    }, [])
    // Handle change for input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        setLoader(true);
        const file = e.target.files[0];
        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.name}`);

        // Upload the file to Firebase storage
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        // Set image URL in the formData state
        setFormData((prevData) => ({
            ...prevData,
            hfImg: imageUrl
        }));
        setMessage('Image Uploaded')
        setLoader(false);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://192.168.1.9:9000/api/services/save-info',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        const data = await res.json();
        if(res.ok){
            setMessage('Data Stored')
        }
    };

    return (
        <>
            <div className="fullEditContent">
                <h1>Edit Info</h1> <hr />
                <div className="fecSubSection">

                    <div className="eiLeft">
                        <div className="previewImg">
                            {isLoader && <>
                                <div className="uploadImg">
                                    <div className="uploadText">
                                        <div className="spinner"></div>
                                        <p>Uploading...</p>
                                    </div>
                                </div>
                            </>}
                            {formData.hfImg ? (
                                <img src={formData.hfImg} alt="Uploaded preview" />
                            ) : (
                                <img src="https://pics.craiyon.com/2023-07-25/b24c483eff83421696aaa91556cae5d3.webp" alt="" />
                            )}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="file"
                                name="hfImg"
                                id="hfImg"
                                onChange={handleImageUpload}
                                placeholder='Upload an image'
                            />
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder='Enter the name of the Person'
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="age"
                                id="age"
                                placeholder='Enter the age'
                                value={formData.age}
                                onChange={handleInputChange}
                            />
                        </form>
                    </div>
                    <div className="eiRight">
                        <h1>Enter the details:</h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="hfHeading"
                                id="hfHeading"
                                placeholder='Enter the Heading*'
                                value={formData.hfHeading}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="hfParagraph"
                                id="hfParagraph"
                                rows={6}
                                placeholder='Enter the Paragraph*'
                                value={formData.hfParagraph}
                                onChange={handleInputChange}
                            />
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditInfo;
