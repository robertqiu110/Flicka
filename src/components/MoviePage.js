import React, { Component } from 'react'
import '../App.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Results from "./Results.js"
import { Helmet } from 'react-helmet'

class MoviePage extends Component {

     _isMounted = false

     state = {
        info: null
     }

    componentDidMount() {
        this._isMounted = true
        const rawId = this.props.match.params.id
        if (!(/^\d+$/.test(rawId))) {
            this.props.history.push("/404")
            return
        }
        const id = parseInt(rawId, 10)
        if (id) {
            axios.post("/api/find", {
                ids: [id]
            }).then(res => {
                if (this._isMounted) {
                    this.setState({
                        info: res.data[0]
                    }, () => {
                        this.results.search([this.state.info])
                    })
                }
            }).catch(err => {
                if (this._isMounted) {
                    this.props.history.push("/404")
                }
            })
        } else {
            this.props.history.push("/404")
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        if (this.state.info == null) {
            return (
                <div className="AppWrapper">
                    <div className="moviePageWrapper">
                        <Link to="/" className="moviePageLogo">Flicka</Link>
                        <div className="moviePageTop">
                            <div className="moviePageImgContainer">
                            </div>
                            <div className="moviePageTopRight">
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            let imgsrc
            if (this.state.info.poster_path == null) {
                imgsrc = require("../images/flicka_placeholder_500.png")
            } else {
                imgsrc = "https://image.tmdb.org/t/p/w500" + this.state.info.poster_path
            }
            let yearHTML = ""
            if (this.state.info.release_date != null) {
                yearHTML = this.state.info.release_date.substring(0, 4)
            }
            let title = this.state.info.title
            let learnMore = ""
            if (title == null) {
                title="Not Found"
                this.props.history.push("/404")
            } else {
                const learnMoreQuery = "https://www.google.com/search?q=" + encodeURIComponent(title + " " + yearHTML)
                learnMore = <a className="moviePageGenreBlock movieLearnMore" href={learnMoreQuery}>Learn More</a>
            }
            let runtimeHTML = ""
            if (this.state.info.runtime != null && this.state.info.runtime > 0) {
                const runtime = this.state.info.runtime
                const hrs = Math.floor(runtime / 60)
                const min = runtime % 60
                if (hrs === 0) {
                    runtimeHTML = min + "m"
                } else {
                    runtimeHTML = hrs + "h " + min + "m"
                }
            }
            let ratingHTML = ""
            if (this.state.info.vote_average != null && this.state.info.vote_average > 0) {
                let rating = this.state.info.vote_average*10
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
                let vote_count = ""
                if (this.state.info.vote_count != null && this.state.info.vote_count > 0) {
                    vote_count = " (" + this.state.info.vote_count.toLocaleString() + " votes)"
                }
                ratingHTML = <span style={{color: ratingColor}}>{rating + "%" + vote_count}</span>
            }
            if (yearHTML !== "" && (runtimeHTML !== "" || ratingHTML !== "")) {
                yearHTML = yearHTML + "\u00A0\u00A0\u2022\u00A0\u00A0"
            }
            if (runtimeHTML !== "" && ratingHTML !== "") {
                runtimeHTML = runtimeHTML + "\u00A0\u00A0\u2022\u00A0\u00A0"
            }
            let overview = this.state.info.overview
            if (overview == null) {
                overview = "No Description"
            }
            let genreBlocks = ""
            if (this.state.info.genres != null && this.state.info.genres.length > 0) {
                const genreList = this.state.info.genres
                genreBlocks = genreList.map((r, index) => (
                    <span className="moviePageGenreBlock" key={index}>{r.name}</span>
                ))
            }
            const genres = (
                <p className="moviePageGenres">
                    {genreBlocks}
                    {learnMore}
                </p>
            )
            return (
                <div className="AppWrapper">
                    <Helmet>
                        <title>{title + " - Flicka"}</title>
                    </Helmet>
                    <div className="moviePageWrapper">
                        <Link to="/" className="moviePageLogo">Flicka</Link>
                        <div className="moviePageTop">
                            <div className="moviePageImgContainer">
                                <img src={imgsrc} alt="" className="moviePageImg"/>
                            </div>
                            <div className="moviePageTopRight">
                                <p className="moviePageTitle">{title}</p>
                                <p className="moviePageSmallDetails">
                                    {yearHTML}{runtimeHTML}{ratingHTML}
                                </p>
                                {this.state.info.tagline != null && <p className="moviePageTagline">{this.state.info.tagline}</p>}
                                <p className="moviePageOverview">{overview}</p>
                                {genres}
                            </div>
                        </div>
                        <Results ref={instance => this.results = instance} autoScroll={false} groupSize={20} limit={100} newTab={false} />
                    </div>
                </div>
            )
        }
    }
}

export default MoviePage
