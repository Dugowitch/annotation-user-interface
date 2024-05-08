// types
import { Lookup } from "../../../types/Lookup";
import { Group, GroupLoadingParams } from "../types/Group";
import { Segment } from "../../transcript/types/Segment";

// utils
import { v4 as uuid } from 'uuid'
import { addGroupToSegmentMapping } from "./segment2GroupManipulations";


const time2SegmentID = (time: number, segments: Lookup<Segment>, type: "start"|"end"): string => {
    const segmentID = segments.keys.find(key => {
        segments.entities[key][type] - time < 0.05
    })

    if (!segmentID)
        return ""
    return segmentID
}

const adaptGroup = (group: GroupLoadingParams, entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string => {
    const {start, end, children, ...GroupCommon} = group
    const id = uuid()
    const transformedGroup: Group = {
        ...GroupCommon,
        id: id,
        startSegmentID: time2SegmentID(start, segments, "start"),
        endSegmentID: time2SegmentID(end, segments, "end"),
        parentID: parentID,
        childrenIDs: adaptGroupArr(children, entities, segments, id)
    }
    entities[id] = transformedGroup
    return id
}

const adaptGroupArr = (groupArr: GroupLoadingParams[], entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string[] => {
    let IDs: string[] = []
    groupArr.forEach(rawGroup => {
        const id = adaptGroup(rawGroup, entities, segments, parentID)
        IDs.push(id)
    })
    return IDs
}

export const adaptGroups = (groups: GroupLoadingParams[]|null|undefined, segments: Lookup<Segment>) => {
    const transformedGroups: Lookup<Group> = { keys: [], entities: {}, }
    if (!groups)   
        return {transformedGroups: transformedGroups, startSegment2Group: {}, endSegment2Group: {}}

    transformedGroups.keys = adaptGroupArr(groups, transformedGroups.entities, segments, undefined)

    const startSegment2Group: Record<string, string[]> = {}
    const endSegment2Group: Record<string, string[]> = {}
    for (let groupID in transformedGroups.entities){
        const group = transformedGroups.entities[groupID]
        addGroupToSegmentMapping(startSegment2Group, group.startSegmentID, groupID)
        addGroupToSegmentMapping(endSegment2Group, group.endSegmentID, groupID)
    }
    return {transformedGroups: transformedGroups, startSegment2Group: startSegment2Group, endSegment2Group: endSegment2Group}
}
