import { FC, FormEvent, MouseEventHandler, useEffect, useState } from "react";

// components
import Button from "../../../components/Button";
import StartEndSelection from "./StartEndSelection";
import AddIcon from '@mui/icons-material/Add';
import TagSet from "./TagSet.tsx.tsx";

// style
import styled, { css } from "styled-components";

// redux
import { useAppDispatch } from "../../../redux/hooks";
import { createOrUpdateGroup, endEditing, selectGroupByID, chooseSegment, startEditing, selectIsEditing, selectStartEndSegmentIDs } from "../redux/groupingSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

// types
import Layer from "../../../types/Layer";
import { GroupTag } from "../../transcript/types/Tag.ts";

// utils
import { addTag, deleteTag, tagNotInTags } from "../utils/tagManipulations.ts";
import { editableBaseStyles } from "../../../style/editableBaseStyles.tsx";


interface GroupFormProps extends Layer, React.HTMLAttributes<HTMLFormElement> {
    groupID?: string,
    parentID?: string,
    parentTags?: GroupTag[],
    submitCallback?: () => void,
}

const GroupFormContainer = styled.form<Layer>` ${({theme, $layer}) => css`
    background: ${theme.layers[$layer].background};
    border-radius: 4px;
    border: 2px solid ${theme.layers[$layer].background};

    & .body {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
    }
    
    & .error {
        font-size: ${theme.text_s};
        color: ${theme.textDanger};
        font-weight: 600;
    }
`}`

const GroupTitleInput = styled.input<Layer>` ${({theme, $layer}) => css`
    ${editableBaseStyles}

    width: 100%;
    padding: 8px;
    font-size: ${theme.heading_m};
    font-weight: 600;
    color: ${theme.textSecondary};
    margin-right: auto;
    background: ${theme.layers[$layer].background};
    outline: none;
    
    &:hover {
        background: ${theme.layers[$layer].hover};
    }
    
    &:active, &:focus {
        background: ${theme.layers[$layer].active};
    }
`}`

const GroupFormActions = styled.div`
    display: flex;
    gap: 8px;
    margin: 4px 8px;

    :first-child {
        margin-left: auto;
    }
`

const StyledCheckbox = styled.div<Layer>` ${({theme}) => css`
    & > * {
        cursor: pointer;
    }

    input[type="checkbox"]{
        border: none;
        outline: none;
        border-radius: 2px;
        width: 1rem;
        height: 1rem;
        accent-color: ${theme.layers[3]["primary"].active};
    }

    :hover, :focus, :active {
        color: ${theme.textPrimary}
    }

    label {
        margin-left: 4px;
    }
`}`

const GroupForm: FC<GroupFormProps> = ({$layer, groupID, parentID, parentTags, submitCallback, ...props}) => {
    const dispatch = useAppDispatch()
    const globalEditing = useSelector(selectIsEditing)
    const [editing, setEditing] = useState(!!submitCallback)
    const [title, setTitle] = useState<string|undefined>("")
    const [error, setError] = useState("")
    const {start: startSegmentID, end: endSegmentID} = useSelector(selectStartEndSegmentIDs)
    const [publish, setPublish] = useState(false)
    const [tags, setTags] = useState<GroupTag[]>([])
    const group = useSelector((state: RootState) => selectGroupByID(state)(groupID))
    
    useEffect(() => { // load existing data if editing, skip if creating
        if (!group)
            return

        dispatch(startEditing(group.parentID))
        setTitle(group.title)
        dispatch(chooseSegment({id: group.startSegmentID, type: "start"}))
        dispatch(chooseSegment({id: group.endSegmentID, type: "end"}))
        setPublish(group.publish)
        setTags(group.tags)
    }, [group])
    
    const resetState = () => {
        setTitle("")
        setError("")
        setPublish(false)
        setTags([])
        setEditing(false)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!(startSegmentID && endSegmentID && tags.length > 0)){
            setError("Chybí povinná pole!")
            return
        }

        dispatch(createOrUpdateGroup({
            id: groupID,
            title: title,
            startSegmentID: startSegmentID,
            endSegmentID: endSegmentID,
            publish: publish,
            parentID: parentID,
            tags: tags,
        }))

        dispatch(endEditing())
        resetState()
        if (submitCallback)
            submitCallback()
    }

    const handleTagAdd = (newTag: string[]) => {
        if (tagNotInTags(newTag, parentTags)){
            setTags(addTag([...tags], newTag))
        }
    }

    const handleTagDelete = (i: number, tag: string) => {
        setTags(deleteTag(tags, i, tag))
    }

    const handleCancelation: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation() // prevent form submission
        dispatch(endEditing())
        resetState()
        if (submitCallback)
            submitCallback()
    }

    const handleEditingStart = () => {
        setEditing(true)
        dispatch(startEditing(parentID))
    }

    if (!editing) {
        return (
            <Button
                icon={<AddIcon />}
                $layer={$layer}
                style={{width: "100%", padding: "8px"}}
                onClick={handleEditingStart}
                disabled={globalEditing}
            >
            Přidat obsahová metadata
            </Button>
        )
    }

    return (
        <GroupFormContainer $layer={$layer} onSubmit={handleSubmit} {...props}>
            <GroupTitleInput
                $layer={$layer+1}
                type="text"
                value={title}
                placeholder="Zadat název"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
            />
            <div className="body">
                <StartEndSelection $layer={$layer+1} />
                <StyledCheckbox $layer={$layer}>
                    <input
                        type="checkbox"
                        id="checkbox"
                        name="checkbox"
                        checked={publish}
                        onChange={e => setPublish(e.target.checked)}
                        onKeyDown={e => e.stopPropagation()}
                    />
                    <label htmlFor="checkbox">zveřejnit</label>
                </StyledCheckbox>
                <TagSet tags={tags} $layer={$layer+1} editable addHandler={handleTagAdd} deleteHandler={handleTagDelete} />
                {error && <p className="error">{error}</p>}
                <GroupFormActions>
                    <Button $size="l" $layer={$layer+1} type="submit">{groupID ? "Uložit" : "Vytvořit"}</Button>
                    <Button $size="l" $color="danger" $layer={$layer+1} onClick={handleCancelation}>Zrušit</Button>
                </GroupFormActions>
            </div>
        </GroupFormContainer>
    )
}

export default GroupForm
