import {useState} from "react";

const useChange = (val) => {

    const [value, setValue]= useState(val);

    const updateValue=(newValue)=>{
        setValue(newValue);
    }

    return [value, updateValue];
}

export default useChange
