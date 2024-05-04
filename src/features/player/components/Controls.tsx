import { FC } from "react";

import SpeedControls from "./SpeedControls";
import PlaybackControls from "./PlaybackControls";
import VolumeControls from "./VolumeControls";
import ZoomControls from "./ZoomControls";

import styled from "styled-components";
import Layer from "../../../types/Layer";
import useWatchPlayingTo from "../hooks/useWatchPlayingTo";

const ControlsContainer = styled.div<Layer>`
    display: flex;
    justify-content: space-around;
    height: 48px;
    padding: 8px 16px;
    border-radius: 0 0 8px 8px;
    background: ${({theme, $layer}) => theme.layers[$layer].background};
`

const Controls : FC<React.HTMLAttributes<HTMLDivElement> & Layer> = ({$layer, ...props}) => {
    useWatchPlayingTo()
    
    return (
        <ControlsContainer $layer={$layer} {...props}>
            <SpeedControls $layer={$layer+1}/>
            <ZoomControls $layer={$layer+1} />
            <PlaybackControls $layer={$layer+1} />
            <VolumeControls />
        </ControlsContainer>
    );
}

export default Controls;
