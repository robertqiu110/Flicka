import React, { Component } from 'react'
import '../App.css'
import axios from 'axios'
import Suggestions from './Suggestions.js'
import debounce from 'lodash.debounce'
import Picked from './Picked.js'
import queryString from 'query-string'
import windowSize from 'react-window-size'

class Search extends Component {

 _isMounted = false

 constructor() {
    super()
    this.onChangeDebounced = debounce(this.onChangeDebounced, 350)
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
 }

 state = {
    query: '',
    suggestions: [],
    loading: false,
    callCounter: 0, //to make sure longer api calls don't override shorter calls made after
    picked: [],
    cursor: -1 // -1 means focus in on search, not -1 means focus is on arrow keys
 }

 componentDidMount() {
    this._isMounted = true
    document.addEventListener('mousedown', this.handleClickOutside)
    this.unListenHistory = this.props.history.listen((location, action) => {
        this.checkURL()
    })
    this.checkURL()
 }

 checkURL = () => {
    const params = queryString.parse(this.props.history.location.search,
        {arrayFormat: 'comma', parseNumbers: true})
    if ("search" in params) {
        let flag = false
        let ids = params["search"]
        if (ids.constructor === Array && ids.length > 0) {
            flag = true
            for (const id of ids) {
                if (!Number.isInteger(id)) {
                    flag = false
                    break
                }
            }
        } else if (Number.isInteger(ids)) {
            ids = [ids]
            flag = true
        }
        if (flag) {
            let idsCur = []
            const pickedList = this.state.picked
            for (const movie of pickedList) {
                idsCur.push(movie["flickaId"])
            }
            if (JSON.stringify(idsCur) === JSON.stringify(ids)) {
                this.props.submit(this.state.picked)
            } else {
                axios.post("/api/find", {
                    ids: ids
                }).then(res => {
                    if (this._isMounted) {
                        this.setState({
                            picked: res.data
                        }, () => {
                            this.props.submit(this.state.picked)
                        })
                    }
                }).catch(err => {
                    if (this._isMounted) {
                        this.props.history.push("/404")
                    }
                })
            }
        } else {
            this.props.history.push("/404")
        }
    }
 }

 componentWillUnmount() {
    this._isMounted = false
    document.removeEventListener('mousedown', this.handleClickOutside)
    this.unListenHistory()
 }

 /**
  * Set the wrapper ref
  */
 setWrapperRef(node) {
    this.wrapperRef = node
 }

 /**
  * Alert if clicked on outside of element
  */
 handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.suggestions.length > 0) {
        this.setState({
            suggestions: [],
            cursor: -1
        })
      }
    }
 }

 deletePick = (info) => {
    this.setState(prevState => {
        let newArr = prevState.picked
        let removeIndex = -1
        for (var i = 0; i < newArr.length; i++) {
            if (newArr[i]["flickaId"] === info["flickaId"]) {
                removeIndex = i
                break
            }
        }
        if (removeIndex !== -1) {
            newArr.splice(removeIndex, 1)
        }
        return {
            picked: newArr
        }
    })
 }

 clearPicks = () => {
    this.setState({
        picked: []
    })
 }

 pickMovie = (info) => {
    this.search.value = ''
    this.search.focus()
    this.setState(prevState => {
        let newArr = prevState.picked
        let checker = -1
        for (const movie of newArr) {
            if (movie["flickaId"] === info["flickaId"]) {
                checker = 1
                break
            }
        }
        if (checker === -1) {
            newArr = newArr.concat(info)
        }
        return {
            query: '',
            suggestions: [],
            picked: newArr,
            cursor: -1
        }
    })
 }

 getSuggestions = () => {
    this.setState(prevState => {
        return { loading: true, callCounter: prevState.callCounter + 1 }
    }, () => {
        const curCounter = this.state.callCounter
        axios.post("/api/suggestions", {
            searchQuery: this.state.query
        }).then(res => {
            if (this._isMounted) {
                if (this.state.callCounter === curCounter) {
                    this.setState({
                        suggestions: res.data,
                        loading: false
                    })
                }
            }
        }).catch(err => {
            if (this._isMounted) {
                if (this.state.callCounter === curCounter) {
                    this.setState({
                        suggestions: [],
                        loading: false
                    })
                }
            }
        })
    })
 }

 handleInputChange = () => {
   this.setState({
        query: this.search.value
   }, () => {
        if (!this.state.query || this.state.query.length <= 0) {
            this.setState({
                suggestions: []
            })
        } else {
            this.onChangeDebounced()
        }
   })
 }

 onChangeDebounced = () => {
    if (this.state.query && this.state.query.length > 0) {
        this.getSuggestions()
    }
 }

 handleKeyDownSearch = (e) => {
    if ((e.keyCode === 38 || e.keyCode === 40) && this.state.suggestions.length > 0) {
        this.search.blur()
        this.arrows.focus()
        this.arrowKeys(e)
    }
 }

 handleKeyDownArrows = (e) => {
    if (e.keyCode === 13) { //if enter pressed
        e.preventDefault()
        if (this.state.cursor >= 0 && this.state.cursor < this.state.suggestions.length) {
            this.pickMovie(this.state.suggestions[this.state.cursor])
        }
    } else {
        this.arrowKeys(e)
    }
 }

 arrowKeys = (e) => {
    e.preventDefault()
    const cursor = this.state.cursor
    // up arrow
    if (e.keyCode === 38) {
      if (cursor === 0) {
        //transition focus back to search
        this.search.focus()
        this.arrows.blur()
      } else if (cursor > 0) {
        this.setState( prevState => ({
            cursor: prevState.cursor - 1
        }))
      } else {
        this.setState( prevState => ({
            cursor: this.state.suggestions.length - 1
        }))
      }
    } else if (e.keyCode === 40) { // down arrow
      if (cursor < this.state.suggestions.length - 1) {
        this.setState( prevState => ({
            cursor: prevState.cursor + 1
        }))
      } else {
        //transition focus back to search
        this.search.focus()
        this.arrows.blur()
      }
    }
 }

 handleOnFocus = () => {
    this.setState({
        cursor: -1
    })
 }

 handleOnSubmit = (e) => {
    e.preventDefault()
    //this.props.submit(this.state.picked)
    let ids = []
    const pickedList = this.state.picked
    for (const movie of pickedList) {
        ids.push(movie["flickaId"])
    }
    const path = queryString.stringify({search: ids}, {arrayFormat: 'comma'})
    this.props.history.push("/?" + path)
 }

 render() {
   let placeholderText = "Add movies similar to what you're looking for"
   if (this.state.picked.length > 0) {
        placeholderText = "Add more or press enter when ready"
   }
   if (this.props.windowWidth <= 680) {
        placeholderText = "Movies like..."
        if (this.state.picked.length > 0) {
            placeholderText = "Add more or press go!"
        }
   }
   return (
     <div className="searchContainer">
         <div className="searchFormContainer">
            <form className="searchForm" ref={this.setWrapperRef} onSubmit={this.handleOnSubmit}>
               <input
                 type = "text"
                 autoFocus
                 placeholder={placeholderText}
                 ref={input => this.search = input}
                 onChange={this.handleInputChange}
                 onKeyDown={this.handleKeyDownSearch}
                 onFocus={this.handleOnFocus}
                 className={(this.state.query && this.state.query.length > 0) && "noRadius"}
               />
               <div className="searchButtonContainer">
                   <button className={(this.state.query && this.state.query.length > 0) && "noRadius"} disabled={this.state.picked.length === 0}>Go!</button>
                   {this.state.loading && <img src={require("../images/loading.gif")} alt="" className="searchLoading" />}
               </div>
               <input className="searchArrowInput" ref={input => this.arrows = input} onKeyDown={this.handleKeyDownArrows}/>
               {(this.state.query && this.state.query.length > 0) &&
                    <Suggestions results={this.state.suggestions} pickMovieFunc={this.pickMovie.bind(this)} cursor={this.state.cursor} windowWidth={this.props.windowWidth}/>}
            </form>
         </div>
         <Picked results={this.state.picked} deletePickFunc={this.deletePick.bind(this)} clearPicksFunc={this.clearPicks.bind(this)}/>
     </div>
   )
 }
}

export default windowSize(Search)