import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectSpeed } from "../redux/playbackSlice"
import { useSelector } from "react-redux"

const useSetSpeed = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const speed = useSelector(selectSpeed)

    // listen for playback changes
    useEffect(() => {
        wavesurfer.current?.setPlaybackRate(speed/100)
    }, [speed])
}

export default useSetSpeed
