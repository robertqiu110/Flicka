import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function About() {
  return (
    <div className="AppWrapper">
        <Helmet>
            <title>About - Flicka</title>
        </Helmet>
        <div className="moviePageWrapper">
            <Link to="/" className="moviePageLogo">Flicka</Link>
            <div className="bannerContainer">
                <img src={require("../images/flickabanner.png")} alt="" className="flickaBanner"/>
                <p>About</p>
            </div>
            <p className="aboutIntro">Picture this: you've just finished watching Lord of the Rings. You're craving more high fantasy,
            but with a little sci-fi twist. Perhaps also with some Indiana Jones style action and a bit of Jumanji wonder.
            Where are you gonna find <em>THAT</em>, you say?</p>
            <p className="aboutTitle">Enter Flicka!</p>
            <p className="aboutText">Unlike other recommendation engines, Flicka lets you find movies similar to not just one movie, but a group of movies.
            Our unique algorithm calculates scores for each movie based on more than a thousand features extracted through machine learning, such as happiness or mystery, and we
            combine these and compare it with other movies to find the most alike. This way, you'll find the movies most intrinsically similar to what you're looking for!</p>
            <p className="aboutTitle">The Mission</p>
            <p className="aboutText">The goal of Flicka is to make finding your next movie a breeze. Simplicity is at the heart of what we do. In the future we plan to add more
            features to improve the process even more, such as a watchlist, curated collections, and discussions. Please give us feedback and spread the word if you like what
            we're doing!</p>
            <p className="aboutTitle">Contact</p>
            <p className="aboutText">This is a project developed by Robert Qiu. To contact me, you can email me at <
            a href="mailto:robertqiu@berkeley.edu">robertqiu@berkeley.edu</a> or add me on <a href="https://www.linkedin.com/in/robert-q-09612295/">LinkedIn</a>.
            I'd love to hear suggestions for improvement or any feedback you may have, so shoot away! To stay updated with Flicka news, you can follow <
            a href="https://twitter.com/flicka_app">@flicka_app</a> on Twitter.</p>
            <p className="aboutTitle">Credits</p>
            <p className="aboutText">This app uses the MovieLens dataset and the TMDB database, but is not endorsed or affiliated with either. Note: the latest MovieLens dataset
            does not contain any movies from 2020 as of yet, but as newer versions come out the app will be updated accordingly.</p>
            <p className="aboutText aboutTextLast">&copy; 2020 Flicka. All rights reserved.</p>
        </div>
    </div>
  )
}

 export default About