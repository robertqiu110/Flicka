import React, { Component } from 'react'
import '../App.css'
import Search from "./Search.js"
import Results from "./Results.js"
import { Helmet } from 'react-helmet'

class Main extends Component {

    render() {
      return (
        <div className="AppWrapper">
            <Helmet>
                <title>Flicka - Find Similar Movies!</title>
            </Helmet>
            <p className="main_logo">Flicka</p>
            <p className="below_logo_text">A movie recommendations engine.</p>
            <Search submit={(param) => this.results.search(param)} history={this.props.history} />
            <Results ref={instance => this.results = instance} autoScroll={true} groupSize={40} limit={200} newTab={true} />
        </div>
      )
    }
}

export default Main
