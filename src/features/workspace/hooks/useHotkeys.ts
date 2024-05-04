import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { historyRedo, historyUndo, save } from "../redux/workspaceSlice"
import { playPause, skipBy } from "../../player/redux/playbackSlice"


export const useHotkeys = () => {
    const dispatch = useAppDispatch()

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
                dispatch(skipBy({value: 3, changedBy: "controlsButton"}))
                break

            case "ArrowLeft":
                dispatch(skipBy({value: -3, changedBy: "controlsButton"}))
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
