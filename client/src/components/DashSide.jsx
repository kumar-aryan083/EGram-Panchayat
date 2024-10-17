import React from 'react'
import './css/DashSide.css'

const DashSide = ({
  setSideContent
}) => {
  return (
    <>
      <div className="fullDashSide">
        <ul>
          <li onClick={() => {setSideContent('1')}}>Home</li>
          <li onClick={() => {setSideContent('2')}}>Edit Information</li>
          <li onClick={() => {setSideContent('3')}}>Add Announcement</li>
        </ul>
      </div>
    </>
  )
}

export default DashSide