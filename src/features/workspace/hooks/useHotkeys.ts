import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { historyRedo, historyUndo, save } from "../redux/workspaceSlice"
import { playPause, selectClosestRedionsStarts, setTime, skipBy } from "../../player/redux/playbackSlice"
import { useSelector } from "react-redux"


export const useHotkeys = () => {
    const dispatch = useAppDispatch()
    const [prevStart, nextStart] = useSelector(selectClosestRedionsStarts)

    const handleHotkeys = (e: KeyboardEvent) => {
        switch (e.key) {
            case "z":
                if (e.ctrlKey){
                    dispatch(historyUndo())
                }
                break

            case "Z":
                if (e.ctrlKey && e.shiftKey){
                    dispatch(historyRedo())
                }
                break
                
            case "y":
                if (e.ctrlKey){
                    dispatch(historyRedo())
                }
                break

            case " ":
                const focusedElement = document.activeElement as HTMLElement|null
                focusedElement?.blur()
                e.preventDefault()
                dispatch(playPause())
                break

            case "ArrowRight":
                if (e.shiftKey){
                    dispatch(setTime({value: nextStart, changedBy: "controlsButton"}))
                } else {
                    dispatch(skipBy({value: 3, changedBy: "controlsButton"}))
                }
                break

            case "ArrowLeft":
                if (e.shiftKey){
                    dispatch(setTime({value: prevStart, changedBy: "controlsButton"}))
                } else {
                    dispatch(skipBy({value: -3, changedBy: "controlsButton"}))
                }
                break

            case "s":
                if (e.ctrlKey){
                    e.preventDefault()
                    dispatch(save())
                }
                break

            default:
                break
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleHotkeys)
        return () => window.removeEventListener("keydown", handleHotkeys)
    }, [handleHotkeys])
}
