import { FC, useState } from "react"

// components
import { Combobox } from "@reach/combobox"
import { ComboboxPopover as BaseComboboxPopover } from "@reach/combobox";
import { ComboboxList as BaseComboboxList } from "@reach/combobox";
import ComboboxOptionSet from "./ComboboxOptionSet"
import { ComboboxInput as BaseComboboxInput } from "@reach/combobox"

// style
import styled, { css } from "styled-components"
import "@reach/combobox/styles.css"
import { editableBaseStyles } from "../../../style/editableBaseStyles"
import { clickableBaseStyles } from "../../../style/clickableBaseStyles";
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles";

// redux
import { useSelector } from "react-redux"
import { selectGroupTags } from "../../workspace/redux/workspaceSlice"

// types
import Layer from "../../../types/Layer"


interface TagSelectionProps extends Layer {
    onSelection: (tags: string[]) => void,
}

export const ComboboxInput = styled(BaseComboboxInput)<Layer>` ${({theme, $layer}) => css`
    ${editableBaseStyles}
    background: ${theme.layers[$layer].background};
    color: ${theme.textSecondary};
    width: 100%;
    padding: 4px 8px;
    font-size: 1rem;
    outline: none;
    
    &:hover {
        background: ${theme.layers[$layer].hover};
    }
    
    &:active, &:focus {
        border-color: ${theme.layers[$layer]["primary"].active};
        background: ${theme.layers[$layer].active};
    }
`}`

export const ComboboxList = styled(BaseComboboxList)<Layer>` ${({theme, $layer}) => css`
    background-color: transparent;
    border: none;
    
    [data-reach-combobox-option] {
        ${clickableBaseStyles}

        background-color: ${theme.layers[$layer].background};
        color: ${theme.textSecondary};
        padding: 2px 4px;
        font-size: 1rem;
        display: flex;
        align-items: center;

        &[data-highlighted], &:hover {
            background-color: ${theme.layers[$layer].active};
            color: ${theme.textPrimary};
        }
    }
`}`

export const ComboboxPopover = styled(BaseComboboxPopover)<Layer>`
    ${scrollableBaseStyles}
    background-color: ${({theme, $layer}) => theme.layers[$layer].background};
    border-radius: 4px;
    border: 1px solid ${({theme, $layer}) => theme.layers[$layer].active};
    box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
    padding: 4px;
    bottom: 8px;
`

const TagSelection: FC<TagSelectionProps> = ({$layer, onSelection}) => {
    const [term, setTerm] = useState("")
    const groupTags = useSelector(selectGroupTags)

    return (<>
        <Combobox aria-label="Metadata" openOnFocus>
            <ComboboxInput
                $layer={$layer}
                value={term}
                onChange={e => setTerm(e.target.value)}
                selectOnClick
                placeholder="Prohledávat metadata"
                onKeyDown={e => e.stopPropagation()}
            />
                <ComboboxPopover $layer={$layer}>
                    <ComboboxList $layer={$layer}>
                        <ComboboxOptionSet
                            term={term}
                            onSelection={onSelection}
                            parentTags={[]}
                            options={groupTags}
                            depth={0}
                        />
                    </ComboboxList>
                </ComboboxPopover>
        </Combobox>
    </>)
}

export default TagSelection
