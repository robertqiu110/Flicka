import React from 'react'
import '../App.css'
import PickedMovie from './PickedMovie.js'

 const Picked = (props) => {
    const options = props.results.map((r, index) => (
        <PickedMovie info={r} key={index} deletePickFunc={props.deletePickFunc} />
    ))
    return (
        <div className="picked">
            {options}
            {props.results.length > 0 && (
                <div className="pickedClear" onClick={props.clearPicksFunc}>Clear</div>
            )}
        </div>
    )
 }

 export default Picked