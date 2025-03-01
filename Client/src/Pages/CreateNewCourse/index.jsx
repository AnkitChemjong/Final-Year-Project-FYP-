import React from 'react';
import CommonButton from '@/Components/CommonButton';
import { Card,CardContent } from '@/Components/ui/card';
import { Tabs,TabsList,TabsTrigger,TabsContent } from '@/Components/ui/tabs';
import CourseCurriculum from '@/Components/AddNewCourse/CourseCurriculum';
import CourseLanding from '@/Components/AddNewCourse/CourseLanding';
import CourseSetting from '@/Components/AddNewCourse/CourseSetting';

export default function CreateNewCourse() {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between'>
          <h1 className='text-3xl font-bold mb-5'>Create New Course</h1>
           <CommonButton text="Submit"/>
      </div>
      <Card>
        <CardContent>
            <div className='container mx-auto p-4'>
                   <Tabs defaultValue="curriculum" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                        <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                        <TabsTrigger value="setting">Setting</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curriculum">
                         <CourseCurriculum/>
                    </TabsContent>
                    <TabsContent value="course-landing-page">
                       <CourseLanding />
                    </TabsContent>
                    <TabsContent value="setting">
                      <CourseSetting />
                    </TabsContent>
                   </Tabs>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
