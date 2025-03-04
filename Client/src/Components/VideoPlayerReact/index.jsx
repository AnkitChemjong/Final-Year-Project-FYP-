import React, { useRef, useState,useEffect } from 'react';
import ReactPlayer from 'react-player';


export default function VideoPlayerReact({width="100%",height="100%",url}) {
    const [playing,setPlaying]=useState(false);

    const playerRef=useRef(null);

    
    useEffect(() => {
        const handleKeyDown = (event) => {
          if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
    
            if (event.key === 'ArrowRight') {  // Right Arrow to skip forward 10 seconds
              playerRef.current.seekTo(currentTime + 10);
            }
    
            if (event.key === 'ArrowLeft') {  // Left Arrow to skip backward 10 seconds
              playerRef.current.seekTo(Math.max(currentTime - 10, 0)); // Avoid negative time
            }
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        // Cleanup event listener on component unmount
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

  return (
    <div
    className={`relative bg-gray-900 rounded-lg
     overflow-hidden shadow-2xl transition-all 
     duration-300 ease-in-out`} 
     style={{
        width,height
     }}
    >
      <ReactPlayer
      ref={playerRef}
      className="absolute top-0 left-0"
      width={'100%'}
      height={'100%'}
      playing={playing}
      url={url}
      controls
      />
     
    </div>
  )
}
