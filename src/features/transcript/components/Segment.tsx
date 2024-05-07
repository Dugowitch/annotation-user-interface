import { FC, MouseEventHandler, useEffect, useRef, useState } from "react"

// components
import Button from "../../../components/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SegmentActions from "./SegmentActions";
import SpeakerSelection from "./SpeakerSelection"
import SegmentText from "./SegmentText";
import SpermMarker from "../../grouping/components/SpermMarker";

// style
import styled, { css } from "styled-components";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteSegment, mergeSegment, selectSegmentByID } from "../redux/transcriptSlice";
import { playPauseSegment, selectIsPlaying, setTime } from "../../player/redux/playbackSlice";
import { selectGroupsByStartSegment, selectIsEditing, selectStartEndSegmentIDs } from "../../grouping/redux/groupingSlice";

// types
import type Layer from "../../../types/Layer"
import type { Segment } from "../types/Segment";
import type { RootState } from "../../../redux/store";

// utils
// @ts-ignore
import { rgba } from "@carbon/colors"
import { time2FormatedString } from "../../../utils/time2FormatedString";
import { useScrollToSegment } from "../hooks/useScrollToSegment";


interface SegmentProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    segmentID: string,
    regionsReloadCallback: () => void
}

const SegmentLayout = styled.div<Layer>` ${({theme, $layer}) => css`
    padding: 4px;
    border-radius: 4px;
    background: ${theme.layers[$layer].background};
    grid-column: 1/2;
    
    &.selecting:hover {
        cursor: pointer;
        background: ${theme.layers[$layer].hover};
        outline: 2px solid ${theme.layers[$layer]["primary"].active};
        
        * {
            pointer-events: none;
            background: none;
        }
    }
    
    &.selected {
        outline: 2px solid ${theme.layers[$layer]["primary"].active};
    }

    &.ingroup {
        background: ${theme.layers[$layer].hover};

        * {
            background: none;
        }
    }
`}`

const Segment: FC<SegmentProps> = ({segmentID, $layer, regionsReloadCallback, className, ...props}) => {
    const data = useSelector((state: RootState) => selectSegmentByID(state)(segmentID))
    const dispatch = useAppDispatch()
    const [isPlaying, setIsPlaying] = useState(false)
    const isAudioPlaying = useSelector(selectIsPlaying)
    const {start: startSegmentID, end: endSegmentID} = useSelector(selectStartEndSegmentIDs)
    const memberGroupIDs = useSelector((state: RootState) => selectGroupsByStartSegment(state)(segmentID))
    const groupEditing = useSelector(selectIsEditing)
    
    const containerRef = useRef<HTMLDivElement>(null)
    const isCursorIn = useScrollToSegment(containerRef, data.start, data.end)

    useEffect(() => {
        if (!isAudioPlaying && isPlaying)
            setIsPlaying(false)
    }, [isAudioPlaying])
    
    const handlePlayPause: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()
        setIsPlaying(!isPlaying)
        dispatch(playPauseSegment({from: data.start, to: data.end, changedBy: `segment:${segmentID}`}))
    }

    const handleSegmentClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (props.onClick)
            props.onClick(e)
        if (groupEditing)
            return
        dispatch(setTime({value: data.start, changedBy: "segment"}))
    }

    if (!data)
        return null
    
    return (<>
        <SegmentLayout
            $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
            className={`
                ${className}
                ${(segmentID === startSegmentID || segmentID === endSegmentID) ? "selected" : ""}`}
            {...props}
            ref={containerRef}
            onClick={handleSegmentClick}
        >
            <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                <SpeakerSelection
                    $layer={(!groupEditing && isCursorIn) ? $layer +2 : $layer+1}
                    segmentID={segmentID}
                    regionReloadCallback={regionsReloadCallback}
                />
                {time2FormatedString(data.start)} – {time2FormatedString(data.end)}
                <SegmentActions
                    style={{marginLeft: "auto"}}
                    $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
                    deleteHandler={() => dispatch(deleteSegment({id: segmentID, callback: regionsReloadCallback}))}
                    mergeHandler={() => dispatch(mergeSegment({id: segmentID, callback: regionsReloadCallback}))}
                />
            </div>
            <div style={{display: "flex"}}>
                <Button
                    $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
                    onClick={handlePlayPause}
                    icon={isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                />
                <SegmentText
                    segmentID={segmentID}
                    $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
                    onClick={e => e.stopPropagation()}
                />
            </div>
        </SegmentLayout>
        {memberGroupIDs && memberGroupIDs.map(id => <SpermMarker key={id} $layer={$layer} groupID={id} />)}
    </>)
}

export default Segment
