import React, { useEffect, useState } from 'react';
import './css/Service.css';
import Loader from './Loader'

const Service = ({ work, user, setMessage, showPersonsApplied, isAdmin, editScheme, newUser }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    // Function to fetch services based on 'work' and user/admin status
    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        setLoader(true);
        try {
            let endpoint;
            // Set endpoint based on the type of work and if user is an admin or not
            if (isAdmin) {
                if (work === 'Created Services') {
                    endpoint = 'admin/createdServices';
                } else if (work === 'Updated Services') {
                    endpoint = 'admin/updatedServices';
                }
            } else {
                if (work === 'Pending Applied Services') {
                    endpoint = 'user/Pending-Applied-Services';
                } else if (work === 'Approved Applied Services') {
                    endpoint = 'user/Approved-Applied-Services';
                }
            }

            const res = await fetch(`http://192.168.1.9:9000/api/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await res.json();
            if (res.ok) {
                // Check if the data contains the correct services based on the endpoint
                if (isAdmin) {
                    setServices(data.cServices || data.uServices || []);
                } else {
                    setServices(data.pendingServices || data.approvedServices || []);
                }
            } else {
                setError(data.message || 'Failed to fetch services');
            }
        } catch (error) {
            setError('Failed to fetch services');
        } finally {
            setLoading(false);
            setLoader(false);
        }
    };

    const handleOnDelete = async (service) => {
        setLoader(true);
        try {
            const res = await fetch('http://192.168.1.9:9000/api/admin/delete-service', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(service),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                newUser(data.user); // Update user after deletion
                fetchServices(); // Refetch services to reflect deletion
            }
        } catch (error) {
            setError('Failed to delete service');
        }
        setLoader(false);
    };

    useEffect(() => {
        fetchServices();
    }, [work, user]);

    const handleRemove = async (id) => {
        setLoader(true);
        const res = await fetch(`http://192.168.1.9:9000/api/user/remove/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const data = await res.json();

        if (res.ok) {
            const newServices = services.filter((e) => {

                return e._id !== id;
            })
            setServices(newServices);
            setMessage(data.message);
        }
        setLoader(false);
    }
    return (
        <>
            {loader && <Loader/>}
            <div className="serviceWrapper">
                <h2>{work}</h2>
                <hr />

                {loading && <p className="alternateText">Loading...</p>}
                {error && <p>{error}</p>}

                <div className="allServiceBars">
                    {/* Render Services */}
                    {services?.length > 0 ? (
                        services.map((e, i) => (
                            <div className="singleService" key={i}>
                                <div className="ssImgCtrl">
                                    <img src={e?.sImg} alt="" />
                                </div>
                                <div className="ssInfo">
                                    <h3>{e?.title}</h3>
                                    <p>{e?.description}</p>
                                    <div className="ssAction">
                                        <div className="metaInfo">
                                            <div className="tVac">Total Vacancies: {e?.tVac}</div>
                                            <div className="aVac">Total Applied: {e?.applied?.length}</div>
                                        </div>
                                        <div className="adminBtns">
                                            {!isAdmin && <div className="applyBtn" onClick={() => { handleRemove(e._id) }}>Remove</div>}
                                            {isAdmin && (
                                                <>
                                                    <div className="applyBtn" onClick={() => showPersonsApplied(e._id)}>
                                                        Persons Applied
                                                    </div>
                                                    <div className="editBtn" onClick={() => editScheme(e)}>
                                                        Edit
                                                    </div>
                                                    <div className="deleteBtn" onClick={() => handleOnDelete(e)}>
                                                        Delete
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="alternateText">No {work} available</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Service;
