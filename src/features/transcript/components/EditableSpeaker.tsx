import { FC, KeyboardEventHandler, useEffect, useRef, useState } from "react"

// components
import SpeakerItem from "../../../components/SpeakerItem"

// style
import styled, { css } from "styled-components"
import { editableBaseStyles } from "../../../style/editableBaseStyles"

// redux
import { useAppDispatch } from "../../../redux/hooks"

// types
import Layer from "../../../types/Layer"
import { SpeakerTag } from "../types/Tag"
import { deleteSpeaker, updateSpeaker } from "../redux/transcriptSlice"


interface EditableSpeakerProps extends Layer {
    speaker: SpeakerTag,
    deleteCallback: () => void,
}

const LabelInput = styled.input<Layer>` ${({theme, $layer}) => css`
    ${editableBaseStyles}
    padding: 4px 8px;
    background: ${theme.layers[$layer].background};
    flex-grow: 1;
    font-size: 1rem;
    color: ${theme.textSecondary};
    margin-right: 4px;
    outline: none;
    
    &:hover {
        background: ${theme.layers[$layer].hover};
    }

    &:active, &:focus {
        background: ${theme.layers[$layer].active};
    }
`}`

const EditableSpeaker: FC<EditableSpeakerProps> = ({speaker, $layer, deleteCallback}) => {
    const dispatch = useAppDispatch()
    const [label, setLabel] = useState(speaker.label)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { // keep speaker lable synced
        setLabel(speaker.label)
    }, [speaker])

    const handleSpeakerUpdate = () => {
        setLabel(label.trim())
        if (label === speaker.label)
            return

        if (label.length !== 0){
            dispatch(updateSpeaker({...speaker, label: label.trim()}))
        } else {
            deleteCallback()
            dispatch(deleteSpeaker(speaker.id))
        }
    }

    const handleEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
        e.stopPropagation()
        if (inputRef.current && e.key === "Enter")
            inputRef.current.blur()
    }

    return (
        <SpeakerItem key={speaker.id} color={speaker.color} speakerID={speaker.id}>
            <LabelInput
                ref={inputRef}
                $layer={$layer}
                value={label}
                placeholder="Nový mluvčí..."
                onChange={e => setLabel(e.target.value)}
                onBlur={handleSpeakerUpdate}
                onKeyDown={handleEnter}
            />
        </SpeakerItem>
    )
}

export default EditableSpeaker
