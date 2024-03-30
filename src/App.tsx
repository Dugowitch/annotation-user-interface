import { useRef } from "react"

// components
import Controls from "./features/playback/components/Controls"
import Waveform from "./features/waveform/components/Waveform"
import MenuBar from "./features/menu/components/MenuBar"
import SegmentList from "./features/transcript/components/SegmentList"
import GroupList from "./features/grouping/components/GroupList"

// wavesurfer
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// styles
import styled, { createGlobalStyle } from "styled-components";

// hooks
import { useFetchJob } from "./features/job/hooks/useFetchJob"
import { useFetchTranscript } from "./features/transcript/hooks/useFetchTranscript"

// types
import Layer from "./types/Layer";


const BaseStyle = createGlobalStyle`
    body {
        font-family: Inter, system-ui, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-size: ${({theme}) => theme.text_m};

        color: ${({theme}) => theme.textSecondary};
        background: ${({theme}) => theme.gray100};
    }
`

const AppLayout = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    gap: 0 8px;
    overflow: hidden;
    grid-template-columns: 1fr 3fr 1fr;
    grid-template-rows: repeat(3, auto) 1fr;

    & .menuBar {
        grid-column: 1 / -1;
    }
    
    & .waveform {
        grid-column: 1 / -1;
        margin: 0 8px;
    }
    
    & .controls {
        grid-column: 1 / -1;
        margin: 0 8px 16px 8px;
    }

    & .sideBar {
        margin-left: 8px;
    }

    & .segments {
        margin: 0;
    }
`

const ScrollBox = styled.div<Layer>`
    background: ${({theme, $layer}) => theme.layers[$layer].background};
    border-radius: 8px 8px 0 0;
    min-height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    position: relative;
`

function App() {
    useFetchJob()
    useFetchTranscript()
    const waveformRegionsRef = useRef<RegionsPlugin>(RegionsPlugin.create())

    return (<>
        <BaseStyle />
        <AppLayout>
            <MenuBar className="menuBar" $layer={0}/>
            <Waveform waveformRegionsRef={waveformRegionsRef} className="waveform" $layer={1}/>
            <Controls className="controls" $layer={1}/>
            <ScrollBox className="sideBar" $layer={1}>
            </ScrollBox>
            <ScrollBox className="segments" $layer={2}>
                <SegmentList waveformRegionsRef={waveformRegionsRef} $layer={2}/>
            </ScrollBox>
            <GroupList className="groups" $layer={1}>
            </GroupList>
        </AppLayout>
    </>)
}

export default App
