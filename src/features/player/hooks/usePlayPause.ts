import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectIsPlaying } from "../redux/playbackSlice"
import { useSelector } from "react-redux"

const usePlayPause = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const isPlaying = useSelector(selectIsPlaying)

    // listen for playback changes
    useEffect(() => {
        if (isPlaying) {
            wavesurfer.current?.play()
        } else {
            wavesurfer.current?.pause()
        }
    }, [isPlaying])
}

export default usePlayPause
