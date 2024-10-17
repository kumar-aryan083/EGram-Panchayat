import React, { useEffect, useState } from 'react'
import DashSide from '../../components/DashSide'
import './css/Dashboard.css'
import ContentSection from '../../components/ContentSection'

const Dashboard = ({
  user,
  setMessage,
  setPoping
}) => {
  const [content, setContent] = useState(() => {
    const u = localStorage.getItem('content');
    return u ? u : '1'
  });

  const setSideContent = (num) => {
    setContent(num);
  }
  return (
    <>
    <div className="fullDashboard">
      <div className="sideNav">
        <DashSide setSideContent = {setSideContent}/>
      </div>
      <div className="contentSide">
        <ContentSection setPoping = {setPoping} setMessage={setMessage} user = {user} content = {content}/>
      </div>
    </div>
    </>
  )
}

export default Dashboard