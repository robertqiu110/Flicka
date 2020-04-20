import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="footer">
        <p className="footerText">Making movie hunting a little easier, with &#x2764;.&nbsp;&nbsp;&nbsp;<Link to="/about">Learn More</Link></p>
    </div>
  )
}

 export default Footer