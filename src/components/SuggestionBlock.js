import React, { Component } from 'react'
import '../App.css'

class SuggestionBlock extends Component {

 pickMovie = () => {
   this.props.pickMovieFunc(this.props.info)
 }

 render() {
   let imgsrc
   if (this.props.info.poster_path == null) {
        imgsrc = require("../images/flicka_placeholder_92.png")
   } else {
        imgsrc = "https://image.tmdb.org/t/p/w154" + this.props.info.poster_path
   }
   let titleshortened = this.props.info.title
   let threshold = 80
   if (this.props.windowWidth <= 680) {
        threshold = 30
   } else if (this.props.windowWidth <= 900) {
        threshold = 55
   }
   if (titleshortened.length > threshold) {
        titleshortened = titleshortened.slice(0, threshold - 2) + "..."
   }
   let year = ""
   if (this.props.info.release_date != null) {
        year = this.props.info.release_date.substring(0, 4)
   }
   return (
        <li className={"suggestionBlock" +  (this.props.index === this.props.selectedCursor ? " arrowSelectedBlock" : "")} onClick={this.pickMovie}>
            <div className="suggestionBlockImgContainer">
                <img className="suggestionBlockImg" src={imgsrc} alt="" />
            </div>
            <p className="suggestionBlockTitle">{titleshortened}</p>
            <p className="suggestionBlockYear">{year}</p>
        </li>
   )
 }
}

export default SuggestionBlock