import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectVolume } from "../../../features/playback/redux/playbackSlice"
import { useSelector } from "react-redux"

const useSetVolume = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const volume = useSelector(selectVolume)

    // listen for playback changes
    useEffect(() => {
        wavesurfer.current?.setVolume(volume)
    }, [volume])
}

export default useSetVolume
