import React from 'react'
import './css/DashHome.css'

const DashHome = ({
    setPoping
}) => {
    return (
        <>
            <div className="fullDashHome">
                <h1>Welcome to DashBoard</h1>
                <hr />
                <div className="fdhContent">
                    <div className="fdhLeft">
                        <h2>Informations</h2>
                        <hr />
                        <ul>
                            <li>
                                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta.</p>
                                <div className="newBatch">
                                    <i class="fa-solid fa-certificate"></i>
                                    <p>new</p>
                                </div>
                                <div className="infoBtn" onClick={() => {setPoping('My name is Khan.')}}>Show Details</div>
                            </li>
                        </ul>
                    </div>
                    <div className="fdhRight">
                        <h2>Notifications</h2>
                        <hr />
                        <ul>
                            <li>
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga!</p>
                                <div className="newBatch">
                                    <i class="fa-solid fa-certificate"></i>
                                    <p>new</p>
                                </div>
                                <div className="notifiBtn" onClick={() => {setPoping('My name is Khan.')}}>Show Message</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default DashHome