import React, { FC, HTMLAttributes, useState } from "react"

// components
import Segment from "./Segment"

// styles
import styled, { css } from "styled-components"
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles"

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { selectSelecting, chooseSegment } from "../../grouping/redux/groupingSlice";
import { selectSegmentIDs, selectTranscriptError } from "../redux/transcriptSlice"
import { selectJobError } from "../../workspace/redux/workspaceSlice";

// types
import Layer from "../../../types/Layer"
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// hooks
import { useSelectingStartEnd } from "../../grouping/hooks/useSelectingStartEnd";


interface SegmentLayoutProps extends HTMLAttributes<HTMLElement>, Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>
}

const SegmentLayout = styled.section<Layer>` ${({theme, $layer}) => css`
    ${scrollableBaseStyles}

    background: ${theme.layers[$layer].background};
    padding: 8px;
    border-radius: 8px 8px 0 0;
    min-width: 100%;

    display: grid;
    gap: 2px 4px;
    grid-template-columns: 1fr repeat(3, 32px);
    grid-auto-rows: min-content;
`}`

const SegmentList: FC<SegmentLayoutProps> = ({waveformRegionsRef, $layer, ...props}) => {
    const dispatch = useAppDispatch()
    const segmentIDs = useSelector(selectSegmentIDs)
    const selecting = useSelector(selectSelecting)
    const [hoverID, setHoverID] = useState<string>("")
    const [selectionStartIdx, selectionEndIdx] = useSelectingStartEnd(segmentIDs, hoverID)
    const jobError = useSelector(selectJobError)
    const transcriptError = useSelector(selectTranscriptError)

    if (jobError || transcriptError){
        return (
            <SegmentLayout  $layer={$layer}>
                <p>{jobError?.code || transcriptError?.code || "Error"}: {jobError?.message || transcriptError?.message || "unknown error"}</p>
            </SegmentLayout>
        )
    }

    return (
        <SegmentLayout $layer={$layer} {...props} onMouseLeave={() => setHoverID("")}>
            {segmentIDs.map((id, i) =>
                <Segment
                    key={id}
                    className={`
                        ${selecting ? "selecting" : ""}
                        ${(selectionStartIdx >= 0 && i >= selectionStartIdx && i <= selectionEndIdx) ? "ingroup" : ""}`}
                    onClick={selecting ? () => dispatch(chooseSegment({id: id})) : undefined}
                    onMouseOver={selecting ? () => setHoverID(id) : undefined}
                    segmentID={id}
                    $layer={$layer+1}
                    regionsReloadCallback={() => waveformRegionsRef.current.clearRegions()}
                />
            )}
        </SegmentLayout>
    )
}

export default SegmentList
