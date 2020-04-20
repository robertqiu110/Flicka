import React from 'react'
import '../App.css'
import SuggestionBlock from './SuggestionBlock.js'

 const Suggestions = (props) => {
    let newResults = []
    for (const movie of props.results) {
        if (movie.title != null && movie.title !== "") {
            newResults.push(movie)
        }
    }
    const options = newResults.map((r, index) => (
        <SuggestionBlock info={r} key={index} index={index} pickMovieFunc={props.pickMovieFunc} selectedCursor={props.cursor} windowWidth={props.windowWidth}/>
    ))
    return <ul className="suggestions">{options}</ul>
 }

 export default Suggestions