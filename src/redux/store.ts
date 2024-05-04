import { configureStore } from '@reduxjs/toolkit'

// reducers
import playbackReducer from '../features/player/redux/playbackSlice'
import transcriptReducer from "../features/transcript/redux/transcriptSlice"
import groupingReducer from "../features/grouping/redux/groupingSlice"
import workspaceReducer from "../features/workspace/redux/workspaceSlice"

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
    transcript: transcriptReducer,
    grouping: groupingReducer,
    workspace: workspaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Callbacks are passed into these reducers in order to manipulate waveform regions.
        // There is no way around it. WARNING: the callbacks must not update the redux state!
        ignoredActions: ['transcript/updateSegment', 'transcript/deleteSegment', 'transcript/mergeSegment'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
