import { FC } from "react";

// components
import Button from "../../../components/Button";

// style
import styled from "styled-components";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import Layer from "../../../types/Layer";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { play, pause, skipBy, setTime, selectIsPlaying, selectCurrentTimeValue, selectClosestRedionsStarts, selectSkipLength } from "../redux/playbackSlice";
import { selectDuration } from "../../workspace/redux/workspaceSlice";

// utils
import { time2FormatedString } from "../../../utils/time2FormatedString";


/**
 * A container for the playback controls that positions them.
 */
const PlaybackControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    .currentTime {
        width: 7ch;
        margin-left: 8px;
    }
`

/**
 * The component contains playback control buttons, and an input to set the current time.
 * 
 * @returns {JSX.Element} PlaybackControls component
 */
const PlaybackControls : FC<Layer> = ({$layer}) => {
    const dispatch = useAppDispatch()
    const isPlaying = useSelector(selectIsPlaying)
    const length = useSelector(selectDuration)
    const currentTimeValue = useSelector(selectCurrentTimeValue)
    const skipLength = useSelector(selectSkipLength)
    const [prevStart, nextStart] = useSelector(selectClosestRedionsStarts)
    
    return (
        <PlaybackControlsContainer>
            <Button
                $layer={$layer}
                onClick={() => dispatch(setTime({value: prevStart, changedBy: "controlsButton"}))}
                icon={<SkipPreviousRoundedIcon />}
            />
            <Button
                $layer={$layer}
                onClick={() => dispatch(skipBy({value: -skipLength, changedBy: "controlsButton"}))}
                icon={<FastRewindRoundedIcon />}
            >-{skipLength}</Button>
            {isPlaying
                ? <Button $layer={$layer} onClick={() => dispatch(pause())} icon={<PauseRoundedIcon />} />
                : <Button $layer={$layer} onClick={() => dispatch(play())} icon={<PlayArrowRoundedIcon />} />}
            <Button
                $layer={$layer}
                onClick={() => dispatch(skipBy({value: skipLength, changedBy: "controlsButton"}))}
                icon={<FastForwardRoundedIcon />}
            >+{skipLength}</Button>
            <Button
                $layer={$layer}
                onClick={() => dispatch(setTime({value: nextStart, changedBy: "controlsButton"}))}
                icon={<SkipNextRoundedIcon />}
            />
            <span className="currentTime">{time2FormatedString(currentTimeValue)}</span>
            <span> / {time2FormatedString(length)}</span>
        </PlaybackControlsContainer>
    );
}

export default PlaybackControls;
