import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// slice state type
interface PlaybackState {
    isPlaying: boolean,
    currentTime: {
        value: number,
        changedBy: string
    },
    playingTo: number | null,
    speed: number,
    volume: number,
    length: number,
}

// initial state of the slice
const initialState: PlaybackState = {
    isPlaying: false,
    currentTime: {
        value: 0, 
        changedBy: "initial"
    },
    playingTo: null,
    speed: 1.0,
    volume: 1.0,
    length: NaN
}

export const playbackSlice = createSlice({
    name: 'playback',
    initialState,
    reducers: {
        play: (state) => {
            state.isPlaying = true
            playingTo: null
        },
        pause: (state) => {
            state.isPlaying = false
        },
        playSegment: (state, action: PayloadAction<{from:number, to:number, changedBy: string}>) => {
            state.isPlaying = true
            state.currentTime.value = action.payload.from
            state.currentTime.changedBy = action.payload.changedBy
            state.playingTo = action.payload.to
        },
        setTime: (state, action: PayloadAction<{value: number, changedBy: string}>) => {
            state.currentTime.value = action.payload.value
            state.currentTime.changedBy = action.payload.changedBy
        },
        skipBy: (state, action :PayloadAction<{value: number, changedBy: string}>) => {
            state.currentTime.value += action.payload.value
            state.currentTime.changedBy = action.payload.changedBy
        },
        setSpeed: (state, action: PayloadAction<number>) => {
            console.log(`setting speed: ${action.payload}`)
            state.speed = action.payload
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload
        },
        setLength: (state, action: PayloadAction<number>) => {
            state.length = action.payload
        },
    },
})

export const { play, pause, playSegment, setTime, skipBy, setSpeed, setVolume, setLength } = playbackSlice.actions

export const selectIsPlaying = (state: RootState) => state.playback.isPlaying
export const selectCurrentTimeValue = (state: RootState) => state.playback.currentTime.value
export const selectCurrentTimeChangedBy = (state: RootState) => state.playback.currentTime.changedBy
export const selectPlayingTo = (state: RootState) => state.playback.playingTo
export const selectSpeed = (state: RootState) => state.playback.speed
export const selectVolume = (state: RootState) => state.playback.volume
export const selectLength = (state: RootState) => state.playback.length

export default playbackSlice.reducer
