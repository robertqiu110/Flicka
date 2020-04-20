import React, { Component } from 'react'
import './App.css'
import Footer from "./components/Footer.js"
import Main from "./components/Main.js"
import MoviePage from "./components/MoviePage.js"
import About from "./components/About.js"
import NotFound from "./components/NotFound.js"
import ScrollToTop from "./components/ScrollToTop.js"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

class App extends Component {

    render() {
      return (
        <Router>
            <ScrollToTop />
            <div className="App">
                <Switch>
                    <Route exact path="/movie/:id" render={(props) => <MoviePage {...props} key={Math.random()}/>}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/" component={Main}/>
                    <Route component={NotFound}/>
                </Switch>
                <Footer />
            </div>
        </Router>
      )
    }
}

export default App
