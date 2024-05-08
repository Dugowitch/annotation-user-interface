export const addGroupToSegmentMapping = (segment2Group: Record<string, string[]>, segmentID: string, groupID: string) => {
    if (!segment2Group[segmentID]){
        segment2Group[segmentID] = [groupID]
    } else if (!segment2Group[segmentID].includes(groupID)){
        segment2Group[segmentID].push(groupID)
    }
}

export const removeGroupFromSegmentMapping = (segment2Group: Record<string, string[]>, segmentID: string, groupID: string) => {
    if (!segment2Group[segmentID] || !segment2Group[segmentID].includes(groupID))
        return

    if (segment2Group[segmentID].length === 1){
        delete segment2Group[segmentID]
    } else {
        const idx = segment2Group[segmentID].findIndex(member => member === groupID)
        segment2Group[segmentID].splice(idx, 1)
    }
}
