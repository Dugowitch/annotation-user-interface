import { FC, Fragment, useEffect, useState } from "react";

// components
import { ComboboxOption } from "@reach/combobox";

// types
import { GroupTag } from "../../transcript/types/Tag";


// Adapted from https://stackoverflow.com/a/37511463 by Lewis Diamond
export const removeDiacritics = (s: string): string => {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface ComboboxOptionSetProps {
    term: string,
    options?: GroupTag[],
    onSelection: (tags: string[]) => void,
    parentTags: string[],
    depth: number,
}

const ComboboxOptionSet: FC<ComboboxOptionSetProps> = ({term, options, onSelection, parentTags, depth}) => {
    const [flags, setFlags] = useState<boolean[]>([])

    useEffect(() => {
        if (!options){
            setFlags([])
            return
        }
        setFlags(options.map(option => {
            const cleanTerm = removeDiacritics(term).trim().toLocaleLowerCase()
            const cleanOption = removeDiacritics(option.label).trim().toLocaleLowerCase()
            return cleanOption.includes(cleanTerm)
        }))
    }, [options, term])

    // FIXME: search: "aa" -> search: "b" -> search: "z" -> app drops with VVV error in <ComboboxOptionSet>
    // Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

    if (!options)
        return null

    return options.map((option, i) => (
        <Fragment key={option.label}>
            {flags[i] && <ComboboxOption
                value={option.label}
                style={{paddingLeft: `${depth*16}px`}}
                onClick={() => onSelection([...parentTags, option.label])}
            />}
            <ComboboxOptionSet
                term={term}
                options={option.subcategories}
                onSelection={onSelection}
                parentTags={[...parentTags, option.label]}
                depth={depth+1}
            />
        </Fragment>)
    )
}

export default ComboboxOptionSet
