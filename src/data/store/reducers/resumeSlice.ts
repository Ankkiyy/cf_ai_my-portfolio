import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface WorkExperience {
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
}

export interface Education {
    id: string
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    gpa?: string
    description: string
}

export interface ResumeState {
    personalInfo: {
        fullName: string
        email: string
        phone: string
        location: string
        linkedinUrl: string
        githubUrl: string
        portfolioUrl: string
    }
    workExperience: WorkExperience[]
    education: Education[]
    apiToken: string | null
}

const initialState: ResumeState = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: ''
    },
    workExperience: [],
    education: [],
    apiToken: null,
}

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setPersonalInfo(state, action: PayloadAction<Partial<ResumeState['personalInfo']>>) {
            state.personalInfo = { ...state.personalInfo, ...action.payload }
        },
        setFullName(state, action: PayloadAction<string>) {
            state.personalInfo.fullName = action.payload
        },
        setEmail(state, action: PayloadAction<string>) {
            state.personalInfo.email = action.payload
        },
        setPhone(state, action: PayloadAction<string>) {
            state.personalInfo.phone = action.payload
        },
        setLocation(state, action: PayloadAction<string>) {
            state.personalInfo.location = action.payload
        },
        setLinkedinUrl(state, action: PayloadAction<string>) {
            state.personalInfo.linkedinUrl = action.payload
        },
        setGithubUrl(state, action: PayloadAction<string>) {
            state.personalInfo.githubUrl = action.payload
        },
        setPortfolioUrl(state, action: PayloadAction<string>) {
            state.personalInfo.portfolioUrl = action.payload
        },
        setApiToken(state, action: PayloadAction<string | null>) {
            state.apiToken = action.payload
        },
        resetPersonalInfo(state) {
            state.personalInfo = initialState.personalInfo
        },
        clearApiToken(state) {
            state.apiToken = null
        },
        addWorkExperience(state, action: PayloadAction<WorkExperience>) {
            state.workExperience.push(action.payload)
        },
        updateWorkExperience(state, action: PayloadAction<WorkExperience>) {
            const index = state.workExperience.findIndex(exp => exp.id === action.payload.id)
            if (index !== -1) {
                state.workExperience[index] = action.payload
            }
        },
        removeWorkExperience(state, action: PayloadAction<string>) {
            state.workExperience = state.workExperience.filter(exp => exp.id !== action.payload)
        },
        addEducation(state, action: PayloadAction<Education>) {
            state.education.push(action.payload)
        },
        updateEducation(state, action: PayloadAction<Education>) {
            const index = state.education.findIndex(edu => edu.id === action.payload.id)
            if (index !== -1) {
                state.education[index] = action.payload
            }
        },
        removeEducation(state, action: PayloadAction<string>) {
            state.education = state.education.filter(edu => edu.id !== action.payload)
        },
        resetAll() {
            // Return the initial state directly to ensure complete reset
            return initialState
        }
    },
})

export const { 
    setPersonalInfo,
    setFullName,
    setEmail,
    setPhone,
    setLocation,
    setLinkedinUrl,
    setGithubUrl,
    setPortfolioUrl,
    setApiToken,
    resetPersonalInfo,
    clearApiToken,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    resetAll
} = resumeSlice.actions

export default resumeSlice.reducer
