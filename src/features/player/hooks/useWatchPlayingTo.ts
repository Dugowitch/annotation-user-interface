import { useSelector } from "react-redux"
import { pause, selectCurrentTimeValue, selectIsPlaying, selectPlayingTo } from "../redux/playbackSlice"
import { useEffect } from "react"
import { useAppDispatch } from "../../../redux/hooks"

const useWatchPlayingTo = () => {
    const displatch = useAppDispatch()
    const isPlaying = useSelector(selectIsPlaying)
    const currentTime = useSelector(selectCurrentTimeValue)
    const playingTo = useSelector(selectPlayingTo)

    useEffect(() => {
        if (isPlaying && playingTo && currentTime >= playingTo){
            displatch(pause())
        }
    }, [isPlaying, currentTime, playingTo, displatch])
}

export default useWatchPlayingTo
