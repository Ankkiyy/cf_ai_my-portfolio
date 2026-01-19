import { combineReducers } from '@reduxjs/toolkit'

import resumeReducer from './resumeSlice'
import levelingReducer from './levelingSlice'

const rootReducer = combineReducers({
  resume: resumeReducer,
  leveling: levelingReducer,
})

export const whitelist = ['resume', 'leveling'] // Persist both resume and leveling slices

export default rootReducer;
