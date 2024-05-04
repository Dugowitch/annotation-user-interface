import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectZoom } from "../redux/playbackSlice"
import { useSelector } from "react-redux"

const useSetZoom = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const minPxPerSec = useSelector(selectZoom)
    
    // listen for playback changes
    useEffect(() => {
        try {
            wavesurfer.current?.zoom(minPxPerSec)
        } catch (err) {}
    }, [wavesurfer.current, minPxPerSec])
}

export default useSetZoom
