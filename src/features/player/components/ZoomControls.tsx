import { FC } from "react";

// state management
import { useAppDispatch } from "../../../redux/hooks";
import { zoomIn, zoomOut } from "../redux/playbackSlice";

// styles
import styled from "styled-components";
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import Layer from "../../../types/Layer";

// components
import Button from "../../../components/Button";

/**
 * A container for the playback controls that positions them.
 */
const ZoomControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    p {
        margin-right: 8px;
    }
`

const ZoomControls : FC<Layer> = ({$layer}) => {
    const dispatch = useAppDispatch()

    return (
        <ZoomControlsContainer>
            <p>Přiblížení:</p>
            <Button $layer={$layer} onClick={ () => dispatch(zoomIn()) }>
                <ZoomInRoundedIcon />
            </Button>
            <Button $layer={$layer} onClick={ () => dispatch(zoomOut()) }>
                <ZoomOutRoundedIcon />
            </Button>
        </ZoomControlsContainer>
    );
}

export default ZoomControls;
