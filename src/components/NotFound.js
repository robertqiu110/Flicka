import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function NotFound() {
  return (
    <div className="AppWrapper">
        <Helmet>
            <title>Not Found - Flicka</title>
        </Helmet>
        <div className="moviePageWrapper">
            <Link to="/" className="moviePageLogo">Flicka</Link>
            <p className="oops">Oops! We couldn't find that.</p>
            <Link to="/" className="takeMeBack">Take me back to safety!</Link>
        </div>
    </div>
  )
}

 export default NotFound