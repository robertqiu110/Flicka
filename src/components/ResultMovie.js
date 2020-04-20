import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

class ResultMovie extends Component {

 render() {
   let toLoad = true
   if (this.props.info.title == null || this.props.info.title === "") {
        toLoad = false
   }
   let imgsrc
   if (this.props.info.poster_path == null) {
        toLoad = false
        imgsrc = require("../images/flicka_placeholder_185.png")
   } else {
        imgsrc = "https://image.tmdb.org/t/p/w342" + this.props.info.poster_path
   }
   let yearHTML = ""
   if (this.props.info.release_date != null) {
        yearHTML = this.props.info.release_date.substring(0, 4)
   }
   let ratingHTML = ""
   if (this.props.info.vote_average != null && this.props.info.vote_average > 0) {
       let rating = this.props.info.vote_average*10
       let ratingColor = "#d2d531"
       switch (true) {
            case (rating < 30):
                ratingColor = "#db2360"
                break
            case (rating < 70):
                ratingColor = "#d2d531"
                break
            default:
                ratingColor = "#21d07a"
       }
       ratingHTML = <span style={{color: ratingColor}}>{rating + "%"}</span>
   }
   if (yearHTML !== "" && ratingHTML !== "") {
        yearHTML = yearHTML + "\u00A0\u00A0\u2022\u00A0\u00A0"
   }
   if (!toLoad) {
        return null
   }
   const content = (
        <>
            <div className="resultMovieImgContainer">
                <img src={imgsrc} alt="" className="resultMovieImg" />
            </div>
            <p className="resultMovieTitle">{this.props.info.title}</p>
            <p className="resultMovieYear">
                {yearHTML}{ratingHTML}
            </p>
        </>
   )
   if (this.props.newTab) {
        return (
            <a className="resultMovie" href={"/movie/" + this.props.info.flickaId} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        )
   } else {
        return (
            <Link className="resultMovie" to={"/movie/" + this.props.info.flickaId}>
                {content}
            </Link>
        )
   }
 }
}

export default ResultMovie