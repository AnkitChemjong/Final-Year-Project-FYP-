import React, { useContext,useEffect } from "react";
import { UseContextApi } from "@/Components/ContextApi";
import { Card, CardContent, CardTitle, CardHeader } from "@/Components/ui/Card";
import CommonButton from "@/Components/CommonButton";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { quizOption } from "@/Utils";


export default function AddQuiz() {
  const { courseQuizFormData, setCourseQuizFormData } = useContext(UseContextApi);

  const handleAddContent = () => {
    setCourseQuizFormData([
      ...courseQuizFormData,
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: "",
      },
    ]);
  };

  const courseQuizFormDataValidation = () => {
    return courseQuizFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item?.question?.trim() !== "" &&
        item?.optionA?.trim() !== "" &&
        item?.optionB?.trim() !== "" &&
        item?.optionC?.trim() !== "" &&
        item?.optionD?.trim() !== "" &&
        item?.answer?.trim() !== ""
      );
    });
  };

  const handleAnswerChange = (value, index) => {
    const updatedQuizData = [...courseQuizFormData];
    updatedQuizData[index].answer = value;
    setCourseQuizFormData(updatedQuizData);
  };


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <CommonButton
          disable={!courseQuizFormDataValidation()}
          func={handleAddContent}
          text="Add Content"
        />
        <div className="mt-4 space-y-4">
          {courseQuizFormData.map((item, index) => (
            <div key={index} className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-bold">Question {index + 1}</h3>
              </div>
              <div className="mt-6 flex flex-col gap-2">
       
                <div>
                  <Label>Question {index+1}</Label>
                  <Input
                    type="text"
                    placeholder="Enter the question"
                    value={item.question}
                    onChange={(e) => {
                      const updatedQuizData = [...courseQuizFormData];
                      updatedQuizData[index].question = e.target.value;
                      setCourseQuizFormData(updatedQuizData);
                    }}
                  />
                </div>

                <div>
                  <Label>Option A</Label>
                  <Input
                    type="text"
                    placeholder="Enter the Option A"
                    value={item.optionA}
                    onChange={(e) => {
                      const updatedQuizData = [...courseQuizFormData];
                      updatedQuizData[index].optionA = e.target.value;
                      setCourseQuizFormData(updatedQuizData);
                    }}
                  />
                </div>
                <div>
                  <Label>Option B</Label>
                  <Input
                    type="text"
                    placeholder="Enter the Option B"
                    value={item.optionB}
                    onChange={(e) => {
                      const updatedQuizData = [...courseQuizFormData];
                      updatedQuizData[index].optionB = e.target.value;
                      setCourseQuizFormData(updatedQuizData);
                    }}
                  />
                </div>

                <div>
                  <Label>Option C</Label>
                  <Input
                    type="text"
                    placeholder="Enter the Option C"
                    value={item.optionC}
                    onChange={(e) => {
                      const updatedQuizData = [...courseQuizFormData];
                      updatedQuizData[index].optionC = e.target.value;
                      setCourseQuizFormData(updatedQuizData);
                    }}
                  />
                </div>
                <div>
                  <Label>Option D</Label>
                  <Input
                    type="text"
                    placeholder="Enter the Option D"
                    value={item.optionD}
                    onChange={(e) => {
                      const updatedQuizData = [...courseQuizFormData];
                      updatedQuizData[index].optionD = e.target.value;
                      setCourseQuizFormData(updatedQuizData);
                    }}
                  />
                </div>

                <div>
                  <Label>Correct Answer</Label>
                  <Select
                    value={item.answer}
                    onValueChange={(value) => handleAnswerChange(value, index)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizOption.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}