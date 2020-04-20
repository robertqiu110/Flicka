import React, { Component } from 'react'
import '../App.css'

class PickedMovie extends Component {

 deletePick = () => {
   this.props.deletePickFunc(this.props.info)
 }

 render() {
   let imgsrc
   if (this.props.info.poster_path == null) {
        imgsrc = require("../images/flicka_placeholder_185.png")
   } else {
        imgsrc = "https://image.tmdb.org/t/p/w342" + this.props.info.poster_path
   }
   let titleshortened = this.props.info.title
   if (titleshortened.length > 15) {
        titleshortened = titleshortened.slice(0, 13) + "..."
   }
   return (
        <div className="pickedMovie" onClick={this.deletePick}>
            <div className="pickedMovieHover">
                <div className="pickedMovieImgContainer">
                    <img src={imgsrc} alt="" className="pickedMovieImg" />
                </div>
                <p className="pickedMovieTitle">{titleshortened}</p>
            </div>
            <p className="pickedMovieRemove">Remove</p>
        </div>
   )
 }
}

export default PickedMovie