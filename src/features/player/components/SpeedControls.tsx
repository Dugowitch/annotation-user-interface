import { FC } from "react";

// components
import IntegerInput from "../../../components/IntegerInput";

// redux
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../redux/hooks";
import { selectSpeed } from "../redux/playbackSlice";
import { setSpeed } from "../redux/playbackSlice";

// style
import styled from "styled-components";

// types
import Layer from "../../../types/Layer";

const SpeedControlsContainer = styled.div`
    display: flex;
    align-items: center;

    p {
        margin-right: 16px;
    }
`

const SpeedControls : FC<Layer> = ({$layer}) => {
    const dispatch = useAppDispatch()
    const speed = useSelector(selectSpeed)
    
    return (
        <SpeedControlsContainer>
            <p>Rychlost:</p>
            <IntegerInput
                $layer={$layer}
                value={speed}
                $width={"4.5ch"}
                min={1}
                max={100}
                updateGlobalValue={(x) => dispatch(setSpeed(x))}
            /> %
        </SpeedControlsContainer>
    );
}

export default SpeedControls;
