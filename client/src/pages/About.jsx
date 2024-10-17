import React, { useEffect } from 'react'

const About = () => {
  useEffect(() => {
    document.title = 'About | EGram Panchyat'
  }, [])
  return (
    <div>About</div>
  )
}

export default About