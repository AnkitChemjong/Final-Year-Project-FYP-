import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';


export default function CommonRenderFormInput({getCurrentControl,data,setData,error}) {
 let content = null;
    switch (getCurrentControl.componentType) {
      case "input":
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={getCurrentControl?.name} className="text-right">
              {getCurrentControl?.label}
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
        case "number":
          content = (
            <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={getCurrentControl?.name} className="text-right">
                {getCurrentControl?.label}
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
          </div>)
          break;
       case "gender":
        content = (
          <div key={getCurrentControl.name} className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={getCurrentControl?.name} className="text-right">
              {getCurrentControl?.label}
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
              className="col-span-3"
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
              className="col-span-3"
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
                {getCurrentControl?.label}
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
                className="col-span-3"
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
              {getCurrentControl?.label}
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
