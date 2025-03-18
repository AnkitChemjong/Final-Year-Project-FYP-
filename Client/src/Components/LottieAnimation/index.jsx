import React from 'react'
import Lottie from "lottie-react";

export default function LottieAnimation({animationData,speed,height,width}) {
  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Lottie animationData={animationData} speed={speed} />
    </div>
  )
}
