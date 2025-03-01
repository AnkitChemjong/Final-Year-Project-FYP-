import React,{ useContext,useState } from 'react';
import CommonRenderFormInput from '@/Components/CommonRenderFormInput';
import { courseLandingPageFormControls } from '@/Utils';
import { UseContextApi } from '@/Components/ContextApi';
import { Card,CardContent,CardTitle,CardHeader } from '@/Components/ui/card';
import { courseLandingFormValidation } from '@/FormValidation';

export default function CourseLanding() {
    const {courseLandingFormData, setCourseLandingFormData}=useContext(UseContextApi);
    const [error, setError] = useState({});
    const handleSubmit=()=>{
        if(setError(courseLandingFormValidation(courseLandingFormData))){
            console.log("hello")
        }
    }
  return (
   <Card>
    <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>

    </CardHeader>
    <CardContent>
        <div className='flex flex-col gap-2'>
        {
            courseLandingPageFormControls?.map((item,index)=>{
                    return (
                      <CommonRenderFormInput key={index} getCurrentControl={item} data={courseLandingFormData} setData={setCourseLandingFormData} error={error}/>
                    )
                  })
        }
        </div>
    </CardContent>
   </Card>
  )
}
