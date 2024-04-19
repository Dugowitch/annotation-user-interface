// redux
import { createAsyncThunk } from '@reduxjs/toolkit'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// types
import type { SegmentStorage, Transcript, TranscriptLoadingParams } from "../types/Transcript"
import type { RootState } from '../../../redux/store'
import type { SegmentUpdatePayload, SegmentCreationPayload } from '../types/SegmentActionPayload'
import { Segment } from '../types/Segment'
import { SpeakerTag } from '../types/Tag'
import { SegmentSnapshot } from '../../history/types/History'

// utils
import { v4 as uuid } from 'uuid'
import axios from "../../../utils/getAxios"
import { segmentWords2String } from '../../../utils/segmentWords2String'

// testing
import { JOB_ID } from '../../../testing/test.config'


export const fetchTranscript = createAsyncThunk("transcript", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<TranscriptLoadingParams>(`${JOB_ID}/transcript`)
        return data
    } catch (err) {
        if (!(err instanceof Error && "response" in err && err.response instanceof Object && "data" in err.response)){
            throw {code: 400, message: "Unknown error."}
        }
        throw rejectWithValue(err.response.data);
    }
})

const initialState: Transcript = {
    id: "",
    status: "idle",
    source: "",
    created_at: "",
    specialChar: "",
    lastFocusedSegment: "",
    speaker_tags: null,
    segments: {
        keys: [],
        region2ID: {},
        entities: {}
    }
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
            state.segments.region2ID[action.payload.regionID] = id
        },
        updateSegment: (state, action: PayloadAction<SegmentUpdatePayload>) => {
            let {type, key, change, callback} = action.payload
            let segment = null

            // update entity
            if (type === "region"){
                key = state.segments.region2ID[key]
            }
            if (key){
                segment = state.segments.entities[key]
                state.segments.entities[key] = {...segment, ...change}
            }
            
            // set regionID on region load
            if (change.regionID){
                state.segments.region2ID[change.regionID] = key
            }

            // FIXME: update state.segments.keys order by state.segments.entities[key].start (possibly changed)

            // trigger region update on waveform
            // WARNING: the callbacks must not update the redux state!
            if (callback && segment && segment.regionID){
                callback(segment.regionID, {
                    start: change.start || segment.start,
                    end: change.end
                })
            }
        },
        deleteSegment: (state, action: PayloadAction<{id: string, callback: () => void}>) => {
            const idx = state.segments.keys.findIndex(key => key === action.payload.id)
            if (idx >= 0 && idx < state.segments.keys.length){
                state.segments.keys.splice(idx, 1)
            }
            const {regionID} = state.segments.entities[action.payload.id]
            
            delete state.segments.entities[action.payload.id]
            
            if (regionID){                
                // delete regionID from id lookup
                delete state.segments.region2ID[regionID]
            }

            // reload waveform regions
            // WARNING: the callbacks must not update the redux state!
            action.payload.callback()
        },
        mergeSegment: (_, __: PayloadAction<{id: string}>) => {
            // TODO: implement
        },
        setSpecialChar: (state, action: PayloadAction<string>) => {
            state.specialChar = action.payload
        },
        setLastFocusedSegment: (state, action: PayloadAction<string>) => {
            state.lastFocusedSegment = action.payload
        },
        setSegmentsFromHistory: (state, action: PayloadAction<Omit<SegmentStorage, "region2ID">>) => {
            // load data from history
            state.segments.entities = action.payload.entities
            state.segments.keys = action.payload.keys
            state.segments.region2ID = {}
            
            // reset variables
            state.specialChar = ""
            state.lastFocusedSegment = ""

            // FIXME: rerender regions
        },
        setSpeakersFromHistory: (state, action: PayloadAction<SpeakerTag[]>) => {
            state.speaker_tags = action.payload
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchTranscript.pending, (state, _) => {
            state.status = "loading"
        }).addCase(fetchTranscript.fulfilled, (state, action) => { // load segments from API response
            const transformedSegments: SegmentStorage = {
                keys: [],
                region2ID: {},
                entities: {},
            }
            action.payload.segments?.forEach(segmentRaw => {
                const segment: Segment = {
                    ...segmentRaw,
                    start: Number(segmentRaw.start.toFixed(1)),
                    end: Number(segmentRaw.end.toFixed(1)),
                    words: segmentWords2String(segmentRaw.words),
                }
                const id = uuid()
                transformedSegments.keys.push(id)
                transformedSegments.entities[id] = segment
            })
            return {...state, status: "success", ...action.payload, segments: transformedSegments}
        }).addCase(fetchTranscript.rejected, (state, _) => {
            state.status = "error"
            // TODO: handle error message
        })
    }
})

export const { createSegment, updateSegment, deleteSegment, mergeSegment, setSpecialChar, setLastFocusedSegment, setSegmentsFromHistory, setSpeakersFromHistory } = transcriptSlice.actions

export const selectTranscript = (state: RootState) => state.transcript
export const selectTranscriptStatus = (state: RootState) => state.transcript.status
export const selectSegments = (state: RootState) => state.transcript.segments
export const selectSegmentIDs = (state: RootState) => {
    let startIdx = 0
    let endIdx = state.transcript.segments.keys.length
    if (state.grouping.parentStartSegmentID)
        startIdx = state.transcript.segments.keys.findIndex(id => id === state.grouping.parentStartSegmentID)
    if (state.grouping.parentEndSegmentID)
        endIdx = state.transcript.segments.keys.findIndex(id => id === state.grouping.parentEndSegmentID) + 1
    if (startIdx < 0)
        startIdx = 0
    if (endIdx < 0)
        endIdx = state.transcript.segments.keys.length
    return state.transcript.segments.keys.slice(startIdx, endIdx)
}
export const selectSegmentByID = (state: RootState, id: string) => state.transcript.segments.entities[id]
export const selectSegmentStartByID = (state: RootState, id: string) => {
    if (!id)
        return undefined
    return state.transcript.segments.entities[id].start
}
export const selectSegmentEndByID = (state: RootState, id: string) => {
    if (!id)
        return undefined
    return state.transcript.segments.entities[id].end
}
export const selectGroupStartEndByIDs = (state: RootState, startID: string|undefined, endID: string|undefined) => {
    if (!startID || !endID)
        return [-1, -1]
    return [state.transcript.segments.entities[startID].start, state.transcript.segments.entities[endID].end]
    // FIXME: can entities[ID] called from groups return undefined anyhow?
}
export const selectSpecialChar = (state: RootState) => state.transcript.specialChar
export const selectLastFocusedSegment = (state: RootState) => state.transcript.lastFocusedSegment
export const selectSegmentsJSON = (state: RootState) => {
    let filteredEntities: SegmentSnapshot = {}
    state.transcript.segments.keys.forEach(key => {
        const {regionID, ...rest} = state.transcript.segments.entities[key]
        filteredEntities[key] = rest
    })
    return JSON.stringify({
        entities: filteredEntities,
        keys: state.transcript.segments.keys,
    })
}

export default transcriptSlice.reducer
