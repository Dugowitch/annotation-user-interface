import { FC } from "react"

// components
import NamedContainer from "../../../components/NamedContainer"
import EditableSpeaker from "./EditableSpeaker"

// style
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectSpeakers } from "../redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"


interface SpeakerListProps extends Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>,
}

const SpeakerListBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const SpeakerList: FC<SpeakerListProps> = ({$layer, waveformRegionsRef}) => {
    const speakers = useSelector(selectSpeakers)

    return (
        <NamedContainer name="Mluvčí" $layer={$layer}>
            <SpeakerListBody className="body">
                {speakers.map(speaker =>
                    <EditableSpeaker
                        key={speaker.id}
                        $layer={$layer}
                        speaker={speaker}
                        deleteCallback={() => waveformRegionsRef.current.clearRegions()}
                    />)}
            </SpeakerListBody>
        </NamedContainer>
    )
}

export default SpeakerList
