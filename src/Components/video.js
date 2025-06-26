import React from 'react'
import './Video.css'
import ReactDOM from 'react-dom'


function Video(props) {
      const handleClick=(e)=>{ //mute unmute
       
        e.preventDefault();
        e.target.muted=!e.target.muted;
        
    }
    const handleScroll=(e)=>{ //plays the next video after the first has ended
        let next=ReactDOM.findDOMNode(e.target).parentNode.nextSibling;

        if(next)
        {
            next.scrollIntoView();
            e.target.muted=true;
        }
    }
 
  return (
    

    <video src={props.src} className="videos-styling" muted="muted" onClick={handleClick} onEnded={handleScroll}  > 

    </video>



  )
}

export default Video
