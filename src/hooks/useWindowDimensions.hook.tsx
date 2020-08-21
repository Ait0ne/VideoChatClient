import {useState, useEffect} from 'react';


export const useWindowDimensions = () =>   {
    const [width, setWidth] = useState<number>(window.innerWidth)
    const [height, setHeight] = useState<number>(window.innerHeight)
    const changeDimensions = () => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }
    useEffect(() => {
        changeDimensions()
        window.addEventListener('resize', changeDimensions)
        return () =>  window.removeEventListener('resize', changeDimensions)
    }, [])
    return {width, height}
}