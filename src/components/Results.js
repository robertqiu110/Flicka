import React, { Component } from 'react'
import '../App.css'
import axios from 'axios'
import ResultMovie from './ResultMovie.js'
import debounce from 'lodash.debounce'
//import queryString from 'query-string'

class Results extends Component {

 _isMounted = false

 state = {
    pickedIds: [],
    results: [],
    showing: 0,
    loading: false,
    callCounter: 0, //to make sure longer api calls don't override shorter calls made after
    error: false
 }

 search = (picked) => {
    let ids = []
    for (const movie of picked) {
        ids.push(movie["flickaId"])
    }
    this.setState(prevState => {
        return {
            pickedIds: ids,
            results: [],
            showing: this.props.groupSize,
            loading: true,
            callCounter: prevState.callCounter + 1,
            error: false
        }
    }, () => {
        const curCounter = this.state.callCounter
        axios.post("/api/results", {
            pickedIds: ids,
            amount: this.props.groupSize
        }).then(res => {
            if (this._isMounted) {
                if (this.state.callCounter === curCounter) {
                    this.setState({
                        results: res.data,
                        loading: false
                    }, () => {
                        if (this.props.autoScroll) {
                            this.scrollTo()
                        }
                    })
                }
            }
        }).catch(err => {
            if (this._isMounted) {
                if (this.state.callCounter === curCounter) {
                    this.setState({
                        results: [],
                        showing: 0,
                        loading: false,
                        error: true
                    })
                }
            }
        })
    })
    /*
    if (!this.state.loading) {
        let ids = []
        for (const movie of picked) {
            ids.push(movie["flickaId"])
        }
        this.setState({
            pickedIds: ids,
            results: [],
            showing: 40,
            loading: true
        }, () => {
            axios.post("/results", {
                pickedIds: ids,
                amount: 40
            }).then(res => {
                this.setState({
                    results: res.data,
                    loading: false
                }, () => {
                    //const path = queryString.stringify({search: ids}, {arrayFormat: 'comma'})
                    //this.props.history.push("/?" + path)
                    this.scrollTo()
                })
            })
        })
    }*/
 }

 loadMore = () => {
    if (!this.state.loading && this.state.showing < this.props.limit && this.state.showing > 0) {
        this.setState(prevState => {
            return {showing: prevState.showing + this.props.groupSize, loading: true, error: false}
        }, () => {
            axios.post("/api/results", {
                pickedIds: this.state.pickedIds,
                amount: this.state.showing
            }).then(res => {
                if (this._isMounted) {
                    this.setState({
                        results: res.data,
                        loading: false
                    })
                }
            }).catch(err => {
                if (this._isMounted) {
                    this.setState({
                        results: [],
                        showing: 0,
                        loading: false,
                        error: true
                    })
                }
            })
        })
    }
 }

 componentDidMount = () => {
    this._isMounted = true
    window.addEventListener('scroll', this.handleScroll)
 }

 componentWillUnmount = () => {
    this._isMounted = false
    window.removeEventListener('scroll', this.handleScroll)
 }

 handleScroll = debounce(() => {
    // Checks that the page has scrolled to the bottom
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2000) {
        this.loadMore()
    }
 }, 100)

 scrollTo = () => {
    window.scrollTo({top: this.object.offsetTop - 20, behavior: 'smooth'})
 }

 render() {
   if (this.state.error) {
        return (
            <div className="results" ref={input => this.object = input}>
                <p className="resultsTitle">Similar Movies</p>
                <p className="resultsError">Oops! Something went wrong.</p>
            </div>
        )
   }
   const resultingMovies = this.state.results.map((r, index) => (
        <ResultMovie info={JSON.parse(r)} key={index} newTab={this.props.newTab}/>
   ))
   return (
        <div className="results" ref={input => this.object = input}>
            {(this.state.results.length > 0) && <p className="resultsTitle">Similar Movies</p>}
            <div className="resultsContainer">
                {resultingMovies}
            </div>
            {/*(!this.state.loading && this.state.results.length > 0 && this.state.showing < 200) &&
                <p className="resultsLoadMore" onClick={this.loadMore}>Load More</p>*/}
            {(this.state.showing >= this.props.limit && !this.state.loading) &&
                <p className="resultsLoadMore" onClick={() => {window.scrollTo(0, 0)}}>Back to Top</p>}
            {(this.state.loading) && <img src={require("../images/loading.gif")} alt="" className="resultsLoading" />}
        </div>
   )
 }
}

export default Results