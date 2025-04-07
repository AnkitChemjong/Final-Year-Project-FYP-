import React, { useState } from 'react';
import { Input } from '../ui/input';
import { FcSearch } from "react-icons/fc";

export default function Search({ searchFunc, onChangeFunc }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFunc(searchTerm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center mt-2 md:mt-0 md:px-80 relative md:left-10 px-10 w-full">
            <Input 
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.length === 0) {
                        onChangeFunc();
                    }
                }}
                onKeyDown={handleKeyDown}
                className="text-center p-2 border-2 md:h-11 rounded-2xl w-full" 
                placeholder="Search..." 
            />
            <button type="submit">
                <FcSearch 
                    className="w-6 h-6 relative right-9 hover:scale-125 cursor-pointer" 
                />
            </button>
        </form>
    );
}