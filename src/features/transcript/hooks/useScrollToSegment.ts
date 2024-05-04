import { RefObject, useEffect, useState } from "react"

// redux
import { useSelector } from "react-redux"
import { selectCurrentTimeValue } from "../../player/redux/playbackSlice"


export const useScrollToSegment = (segmentRef: RefObject<HTMLDivElement>, start: number|undefined, end: number|undefined) => {
    const [inside, setInside] = useState(false)
    const currentTime = useSelector(selectCurrentTimeValue)

    useEffect(() => {
        if (!start || !end || currentTime < start || currentTime >= end){
            setInside(false)
            return
        }

        setInside(true)
        segmentRef.current?.parentElement?.scrollTo({
            behavior: "smooth",
            top: segmentRef.current.offsetTop - segmentRef.current.parentElement.offsetTop - segmentRef.current.parentElement.clientHeight/3,
        })
    }, [segmentRef, currentTime, start, end])

    return inside
}
