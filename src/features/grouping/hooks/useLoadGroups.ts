import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../redux/hooks"
import { selectGroupsRaw, selectSegments, selectTranscriptStatus } from "../../transcript/redux/transcriptSlice"
import { useEffect } from "react"
import { adaptGroups } from "../utils/adaptGroups"
import { loadGroups } from "../redux/groupingSlice"
import { enableHistory } from "../../workspace/redux/workspaceSlice"


export const useLoadGroups = () => {
    const dispatch = useAppDispatch()
    const status = useSelector(selectTranscriptStatus)
    const groups = useSelector(selectGroupsRaw)
    const segments = useSelector(selectSegments)

    useEffect(() => {
        if (status !== "success")
            return

        const trasnformedData = adaptGroups(groups, segments)
        dispatch(loadGroups(trasnformedData))
        dispatch(enableHistory())
    }, [status])
}
