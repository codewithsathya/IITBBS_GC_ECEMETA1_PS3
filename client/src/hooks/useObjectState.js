import { useState } from "react";

export default function useObjectState(data = {}){
    const [item, setItem] = useState(data)
    function addData(key, value){
        setItem({...item, [key]: value})
    }
    function changeValue(id, key, value){
        setItem((prevData => {
            prevData[id][key] = value;
            return prevData;
        }))
    }

    function addAllData(allData){
        setItem(prevData => {
            let newData = {...prevData, ...allData}
            return newData
        })
    }
    return [item, setItem, addData, changeValue]
}