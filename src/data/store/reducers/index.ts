import { combineReducers } from '@reduxjs/toolkit'

import resumeReducer from './resumeSlice'

const rootReducer = combineReducers({
  resume: resumeReducer,
})

export const whitelist = ['resume'] // Only persist the resume slice

export default rootReducer;
