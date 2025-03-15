import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";


export default function CommonRenderFormInput({getCurrentControl,data,setData,error={},accept=""}) {
 let content = null;
 const currentControlItemValue =data[getCurrentControl.name] || "";
    switch (getCurrentControl.componentType) {
      case "input":
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={getCurrentControl?.name} className="text-right">
              {getCurrentControl?.label}:
            </Label>
            <Input
              type={getCurrentControl?.type}
              placeholder={getCurrentControl.placeholder}
              id={getCurrentControl.name}
              value={data[getCurrentControl.name]}
              name={getCurrentControl.name}
              onChange={(event) =>{setData({
                ...data,
                [event.target.name]:event.target.value,
              })
            }}
              className="col-span-3"
            />
          </div>
            {error[getCurrentControl?.name]? <span className="text-xs text-red-700">{error[getCurrentControl?.name]}</span>:null}
        </div>
          
        );
        break;
        case "file":
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={getCurrentControl?.name} className="text-right">
              {getCurrentControl?.label}:
            </Label>
            <Input
              type={getCurrentControl?.type}
              placeholder={getCurrentControl.placeholder}
              id={getCurrentControl.name}
              name={getCurrentControl.name}
              accept={accept}
              onChange={(event) =>
                {
                  const {name,files}=event.target;
                  setData({
                ...data,
                [name]:files[0],
              })
            }}
              className="col-span-3"
            />
          </div>
            {error[getCurrentControl?.name]? <span className="text-xs text-red-700">{error[getCurrentControl?.name]}</span>:null}
        </div>
          
        );
        break;
        case "select":
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={getCurrentControl?.name} className="text-right">
              {getCurrentControl?.label}:
            </Label>
          <Select
            onValueChange={(value) =>
              setData({
                ...data,
                [getCurrentControl.name]: value,
              })
            }
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getCurrentControl.label} />
            </SelectTrigger>
            <SelectContent>
              {getCurrentControl.options && getCurrentControl.options.length > 0
                ? getCurrentControl.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
          </div>
            {error[getCurrentControl?.name]? <span className="text-xs text-red-700">{error[getCurrentControl?.name]}</span>:null}
          </div>
        );
        break;
      case "textarea":
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 ">
          <div className="grid grid-cols-4 items-center gap-4 ">
          <Label htmlFor={getCurrentControl?.name} className="text-right">
              {getCurrentControl?.label}:
            </Label>
            <Textarea
              id={getCurrentControl.name}
              name={getCurrentControl.name}
              placeholder={getCurrentControl.placeholder}
              value={currentControlItemValue}
              onChange={(event) =>
                setData({
                  ...data,
                  [getCurrentControl.name]: event.target.value,
                })
              }
              
            />
            </div>
            {error[getCurrentControl?.name]? <span className="text-xs text-red-700">{error[getCurrentControl?.name]}</span>:null}
          </div>
        );
        break;
        
       case "gender":
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={getCurrentControl?.name} className="text-right">
              {getCurrentControl?.label}:
            </Label>
            <div className='flex flex-row gap-10'>
               <div className='flex flex-row gap-10 justify-center items-center'>
            <Input
              type={getCurrentControl?.type}
              id={getCurrentControl.name}
              name={getCurrentControl.name}
              value="Male"
              checked={data.gender === "Male"}
              onChange={(event) =>{setData({
                ...data,
                [event.target.name]:event.target.value,
              })
            }}
              className="col-span-3 cursor-pointer"
            />
            <p>Male</p>
               </div>
               <div className='flex flex-row gap-10 justify-center items-center'>
             <Input
              type={getCurrentControl?.type}
              id={getCurrentControl.name}
              name={getCurrentControl.name}
              value="Female"
              checked={data.gender === "Female"}
              onChange={(event) =>{setData({
                ...data,
                [event.target.name]:event.target.value,
              })
            }}
              className="col-span-3 cursor-pointer"
            />
            <p>Female</p>
            </div>
            </div>
           
          </div>
            {error[getCurrentControl?.name]? <span className="text-xs text-red-700">{error[getCurrentControl?.name]}</span>:null}
        </div>)
        break;
        case "date":
          content = (
            <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
                {getCurrentControl?.label}:
              </Label>
              <Input
                type={getCurrentControl?.type}
                id={getCurrentControl.name}
                name={getCurrentControl.name}
                value={data[getCurrentControl.name]}
                onChange={(event) =>{setData({
                  ...data,
                  [event.target.name]:event.target.value,
                })
              }}
                className="col-span-3 cursor-pointer"
              />
            </div>
              {error[getCurrentControl?.name]? <span className="text-xs text-red-700">{error[getCurrentControl?.name]}</span>:null}
          </div>
          );
          break;
      default:
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
              {getCurrentControl?.label}:
            </Label>
            <Input
              type={getCurrentControl?.type}
              placeholder={getCurrentControl.placeholder}
              id={getCurrentControl.name}
              value={data[getCurrentControl.name]}
              name={getCurrentControl.name}
              onChange={(event) =>{setData({
                ...data,
                [event.target.name]:event.target.value,
              })
            }}
              className="col-span-3"
            />
          </div>
            {error[getCurrentControl?.name]? <span className="text-xs text-red-700">{error[getCurrentControl?.name]}</span>:null}
        </div>
        );
        break;
    }
    return content;
}
