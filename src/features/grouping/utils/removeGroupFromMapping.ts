import { Lookup } from "../../../types/Lookup"
import { Group } from "../types/Group"


export const removeGroupFromLookup = (lookup: Lookup<Group>, groupID: string, parentID?: string) => {
    if (parentID){
        const parent = lookup.entities[parentID]
        const idx = parent.childrenIDs.findIndex(childID => childID === groupID)
        parent.childrenIDs.splice(idx, 1)
    } else if (lookup.keys.includes(groupID)) {
        const idx = lookup.keys.findIndex(groupID => groupID === groupID)
        lookup.keys.splice(idx, 1)
    } else {
        let toSearch: string[] = lookup.keys
        for (let i = 0; i < toSearch.length; i++){
            const parent = lookup.entities[toSearch[i]]
            if (!parent || !parent.childrenIDs)
                continue

            if (parent.childrenIDs.includes(groupID)){
                removeGroupFromLookup(lookup, groupID, toSearch[i])
            } else {
                toSearch = toSearch.concat(parent.childrenIDs)
            }
        }
    }
    
    // cascade delete
    const toDelete: string[] = [groupID]
    for (let i = 0; i < toDelete.length; i++){
        const group = lookup.entities[toDelete[i]]
        if (group)
            toDelete.concat(group.childrenIDs)
    }
    toDelete.forEach(deleteID => delete lookup.entities[deleteID])
}
