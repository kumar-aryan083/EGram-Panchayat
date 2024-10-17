import React from 'react'
import './css/ContentSection.css'
import EditInfo from './EditInfo'
import AddNotification from './AddNotification'
import DashHome from './DashHome'

const ContentSection = ({ content, user, setMessage, setPoping }) => {
    const setSection = (content) => {
        localStorage.setItem('content', content);
        switch (content) {
            case '1':
                return <DashHome setPoping = {setPoping}/>
            case '2':
                return <EditInfo user = {user} setMessage={setMessage}/>;
            case '3':
                return <AddNotification user = {user} setMessage={setMessage}/>
        }
    }

    return (
        <div className="fullContentSection">
            {setSection(content)}
        </div>
    )
}

export default ContentSection;
