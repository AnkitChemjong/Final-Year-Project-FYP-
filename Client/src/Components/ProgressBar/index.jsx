import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({isUploading,progress}) {
    const [showProgress,setShowProgress]=useState(false);
    const [animationProgress,setAnimationProgress]=useState(0);

    useEffect(()=>{
        let timer;
        if(isUploading){

            setShowProgress(true);
            setAnimationProgress(progress);
        }
        else{

            timer=setTimeout(()=>{
              setShowProgress(false);
            },1000);
        }
        return ()=>clearTimeout(timer)
    },[isUploading,progress]);


if(!showProgress) return null

return (
    <div className='w-full bg-gray-200 rounded-full h-3 mt-4 mb-4 relative overflow-hidden'>
      <motion.div className='bg-neutral-200 h-3 rounded-full'
      initial={{width:0}}
      animate={{
        width:`${animationProgress}%`,
        transition:{duration:0.5,ease:'easeInOut'}
      }}
      >
        {
            progress >=100 && isUploading && 
            (
               <motion.div
               className='absolute top-0 left-0 right-0 bottom-0 bg-teal-600 opacity-50'
               animate={{
                x:['0%','100%','0%']
               }}
               transition={{
                duration:2,
                repeat:Infinity,
                ease:'linear'
               }}
               />
            )
        }
      </motion.div>
    </div>
  )
}
