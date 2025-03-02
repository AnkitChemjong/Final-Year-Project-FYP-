import React,{ useContext,useState } from 'react';
import CommonRenderFormInput from '@/Components/CommonRenderFormInput';
import { courseLandingPageFormControls } from '@/Utils';
import { UseContextApi } from '@/Components/ContextApi';
import { Card,CardContent,CardTitle,CardHeader } from '@/Components/ui/card';
import { courseLandingFormValidation } from '@/FormValidation';

export default function CourseLanding() {
    const {courseLandingFormData, setCourseLandingFormData}=useContext(UseContextApi);
  return (
   <Card>
    <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>

    </CardHeader>
    <CardContent> 
        {
            courseLandingPageFormControls?.map((item,index)=>{
                    return (
                      <CommonRenderFormInput key={index} getCurrentControl={item} data={courseLandingFormData} setData={setCourseLandingFormData}/>
                    )
                  })
        }
    </CardContent>
   </Card>
  )
}
