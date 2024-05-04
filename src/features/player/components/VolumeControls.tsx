import { FC } from "react";

// state management
import { useAppDispatch } from "../../../redux/hooks";
import { setVolume } from "../redux/playbackSlice";

// styles
import styled from "styled-components";
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';

// components
import Slider from "../../../components/Slider";

const VolumeControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

    p {
        margin-bottom: 2px;
        margin-right: 4px;
    }

    .space {
        margin-left: 12px;
    }
`

const VolumeControls : FC = () => {
    const dispatch = useAppDispatch()

    const handleSliderChange = (newVal: number) => {
        dispatch(setVolume(newVal/100))
    }

    return (
        <VolumeControlsContainer>
            <p>Hlasitost:</p>
            <VolumeMuteRoundedIcon />
            <Slider min={0} max={100} defaultValue={100} onChange={(val) => handleSliderChange(val)}/>
            <VolumeUpRoundedIcon className="space" />
        </VolumeControlsContainer>
    );
}

export default VolumeControls;
