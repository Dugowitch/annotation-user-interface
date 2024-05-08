import { RefObject, useEffect, useState } from "react"

// redux
import { useSelector } from "react-redux"
import { selectCurrentlyPlayingSegmentID } from "../../player/redux/playbackSlice"


export const useScrollToSegment = (segmentRef: RefObject<HTMLDivElement>, segmentID: string) => {
    const [inside, setInside] = useState(false)
    const playingSegmentID = useSelector(selectCurrentlyPlayingSegmentID)

    useEffect(() => {
        if (!playingSegmentID || playingSegmentID !== segmentID){
            setInside(false)
            return
        }

        setInside(true)
        segmentRef.current?.parentElement?.scrollTo({
            behavior: "smooth",
            top: segmentRef.current.offsetTop - segmentRef.current.parentElement.offsetTop - segmentRef.current.parentElement.clientHeight/3,
        })
    }, [segmentRef, playingSegmentID, segmentID])

    return inside
}
