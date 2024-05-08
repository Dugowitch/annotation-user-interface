// style
import { speakerColors } from '../../../style/tagColors'

// redux
import { createSelector } from '@reduxjs/toolkit'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { selectParentStartEndSegmentIDs } from '../../grouping/redux/groupingSlice'

// types
import type { Transcript, TranscriptLoadingParams } from "../types/Transcript"
import type { RootState } from '../../../redux/store'
import type { SegmentUpdatePayload, SegmentCreationPayload } from '../types/SegmentActionPayload'
import { Segment } from '../types/Segment'
import { SpeakerTag } from '../types/Tag'
import { Lookup } from '../../../types/Lookup'
import { APIErrorResponse } from '../../../types/APIErrorResponse'

// utils
import { v4 as uuid } from 'uuid'
import { segment2RegionID } from '../utils/segment2RegionID'
import { adaptSegments } from '../utils/adaptSegments'
import { adaptSpeakers } from '../utils/adaptSpeakers'
import { createFetchAsyncThunk } from '../../../utils/createFetchAsyncThunk'


export const fetchTranscript = createFetchAsyncThunk<TranscriptLoadingParams>("transcript", "transcript")

const initialState: Transcript = {
    id: "",
    status: "idle",
    error: undefined,
    source: "",
    created_at: "",
    specialChar: "",
    lastFocusedSegment: "",
    speakerTags: [],
    segments: {
        keys: [],
        entities: {},
    },
    groups: [],
    region2ID: {},
}

export const transcriptSlice = createSlice({
    name: 'transcript',
    initialState,
    reducers: {
        createSegment: (state, action: PayloadAction<SegmentCreationPayload>) => {
            const idx = state.segments.keys.findIndex((key) => state.segments.entities[key].start > action.payload.start);
            const id = uuid()
            if (idx === -1){
                state.segments.keys.push(id)
            } else {
                state.segments.keys.splice(idx, 0, id);
            }
            state.segments.entities[id] = {
                ...action.payload,
                speaker: "A",
                language: null,
                segment_tags: [],
                words: "",
            }
            state.region2ID[action.payload.regionID] = id
        },
        updateSegment: (state, action: PayloadAction<SegmentUpdatePayload>) => {
            let {type, key, change} = action.payload
            let segment = null

            // update entity
            if (type === "region"){
                key = state.region2ID[key]
            }
            if (key){
                segment = state.segments.entities[key]
                state.segments.entities[key] = {...segment, ...change}
            }

             // ensure keys stay ordered on start change
             if (change.start){
                state.segments.keys = state.segments.keys.sort((a, b) =>
                    state.segments.entities[a].start - state.segments.entities[b].start
                )
            }
        },
        deleteSegment: (state, action: PayloadAction<string>) => {
            const segmentID = action.payload 
            const idx = state.segments.keys.findIndex(key => key === segmentID)
            if (idx >= 0 && idx < state.segments.keys.length){
                state.segments.keys.splice(idx, 1)
            }

            let regionID = segment2RegionID(state.region2ID, segmentID)
            delete state.segments.entities[segmentID]
            if (regionID){                
                // delete regionID from id lookup
                delete state.region2ID[regionID]
            }
        },
        mergeSegment: (state, action: PayloadAction<string>) => {
            const id = action.payload
            const keys = state.segments.keys
            const idx = keys.findIndex(key => key === id)

            if (idx < 0 || idx + 1 >= keys.length)
                return

            const current = state.segments.entities[id]
            const next = state.segments.entities[keys[idx+1]]
            next.start = current.start
            next.words = current.words + " " + next.words
            
            let regionID = segment2RegionID(state.region2ID, id)
            keys.splice(idx, 1)
            delete state.segments.entities[id]

            if (regionID){
                // delete regionID from id lookup
                delete state.region2ID[regionID]
            }
        },
        mapRegion2Segment: (state, action: PayloadAction<{segmentID: string, regionID: string}>) => {
            state.region2ID[action.payload.regionID] = action.payload.segmentID
        },
        setSpecialChar: (state, action: PayloadAction<string>) => {
            state.specialChar = action.payload
        },
        setLastFocusedSegment: (state, action: PayloadAction<string>) => {
            state.lastFocusedSegment = action.payload
        },
        setSegmentsFromHistory: (state, action: PayloadAction<Lookup<Segment>>) => {
            // load data from history
            state.segments.entities = action.payload.entities
            state.segments.keys = action.payload.keys
            
            // reset variables
            state.specialChar = ""
            state.lastFocusedSegment = ""
        },
        setSpeakersFromHistory: (state, action: PayloadAction<SpeakerTag[]>) => {
            state.speakerTags = action.payload
        },
        updateSpeaker: (state, action: PayloadAction<SpeakerTag>) => {
            if (!state.speakerTags)
                state.speakerTags = []

            const idx = state.speakerTags.findIndex(tag => tag.id === action.payload.id)
            if (idx < 0)
                return

            const shouldAddEmpty = state.speakerTags[idx].label === ""
            state.speakerTags[idx] = action.payload

            if (!shouldAddEmpty)
                return

            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            let key_arr = alphabet.split("")
            state.speakerTags.forEach(tag => key_arr = key_arr.filter(k => k !== tag.id))
            
            // if a key is available, add an empty speaker
            if (key_arr.length === 0)
                return

            const emptySpeaker = {
                id: key_arr[0],
                label: "",
                color: speakerColors[alphabet.indexOf(key_arr[0]) % speakerColors.length],
            }
            state.speakerTags.push(emptySpeaker)
        },
        deleteSpeaker: (state, action: PayloadAction<string>) => {
            if (!state.speakerTags)
                return

            const idx = state.speakerTags.findIndex(st => st.id === action.payload)
            state.speakerTags.splice(idx, 1)
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchTranscript.pending, (state, _) => {
            state.status = "loading"
        }).addCase(fetchTranscript.fulfilled, (state, action) => { // load segments from API response
            const {segments, speaker_tags, ...transcriptCommon} = action.payload
            const transformedSegments = adaptSegments(segments)
            const transformedTags = adaptSpeakers(speaker_tags)
            return {...state, status: "success", ...transcriptCommon, segments: transformedSegments, speakerTags: transformedTags}
        }).addCase(fetchTranscript.rejected, (state, action) => {
            state.status = "error"
            state.error = action.payload as APIErrorResponse
        })
    }
})

export const { createSegment, updateSegment, deleteSegment, mergeSegment, mapRegion2Segment, setSpecialChar,
            setLastFocusedSegment, setSegmentsFromHistory, setSpeakersFromHistory, updateSpeaker, deleteSpeaker } = transcriptSlice.actions

export const selectTranscript = (state: RootState) => state.transcript
export const selectTranscriptStatus = (state: RootState) => state.transcript.status
export const selectSegments = (state: RootState) => state.transcript.segments
export const selectSpecialChar = (state: RootState) => state.transcript.specialChar
export const selectLastFocusedSegment = (state: RootState) => state.transcript.lastFocusedSegment
export const selectSpeakers = (state: RootState) => state.transcript.speakerTags
export const selectGroupsRaw = (state: RootState) => state.transcript.groups
export const selectTranscriptError = (state: RootState) => state.transcript.error
const selectSegmentKeys = (state: RootState) => state.transcript.segments.keys
const selectSegmentEntities = (state: RootState) => state.transcript.segments.entities
export const selectSegmentIDs = createSelector(
    [selectParentStartEndSegmentIDs, selectSegmentKeys],
    (parentIDs, keys) => {
        let startIdx = 0
        let endIdx = keys.length
        if (parentIDs.start){
            const idx = keys.findIndex(key => key === parentIDs.start)
            if (idx >= 0)
                startIdx = idx
        }
        if (parentIDs.end){
            const idx = keys.findIndex(key => key === parentIDs.end)
            if (idx >= 0)
                endIdx = idx + 1
        }
        return keys.slice(startIdx, endIdx)
    }
)
export const selectGroupLen = createSelector(
    selectSegmentKeys,
    (keys) => (startSegmentID?: string, endSegmentID?: string) => {
        if (!startSegmentID || !endSegmentID)
            return 0

        let i = keys.findIndex(key => key === startSegmentID)
        if (i < 0)
            return 0

        for (let j = 0; i+j < keys.length; j++){
            if (keys[i+j] === endSegmentID){
                return j + 1
            }
        }
        return 0
    }
)
export const selectSegmentByID = createSelector(
    [selectSegmentEntities],
    (entities) => (id: string) => entities[id]
)
export const selectStartEndTimeBySegmentIDs = createSelector(
    selectSegmentEntities,
    (entities) => (startID: string, endID: string) => ({
        startTime: entities[startID]?.start,
        endTime: entities[endID]?.end
    })
)
export const selectGroupStartEndByIDs = createSelector(
    selectSegmentEntities,
    (entities) => (startID: string|undefined, endID: string|undefined) => {
        if (!startID || !endID)
            return [-1, -1]
        return [entities[startID]?.start || -1, entities[endID]?.end || -1]
    }
)
export const selectSpeakerByID = createSelector(
    selectSpeakers,
    (speakers) => (id: string|undefined) => speakers.find(speaker => speaker.id === id)
)
export const selectSpeaker2Color = createSelector(
    selectSpeakers,
    (speakers) => {
        if (!speakers)
            return {}

        let mapping: Record<string, string> = {}
        speakers.forEach(speaker => {
            if (speaker.color){
                mapping[speaker.id] = speaker.color
            }
        })
        return mapping
    }
)
export const selectSegmentWords = createSelector(
    selectSegmentEntities,
    (entities) => (id: string) => entities[id]?.words || ""
)
export const selectSpeakerIDBySegment = createSelector(
    [selectSegmentByID],
    (segmentByID) => (id: string) => segmentByID(id).speaker
)

export default transcriptSlice.reducer
