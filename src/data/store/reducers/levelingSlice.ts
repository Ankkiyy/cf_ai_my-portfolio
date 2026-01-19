import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Skill {
    id: string
    name: string
    category: string
    xp: number
    level: number
    lastUpdated: string // ISO date string
    parentId: string | null // For tree structure
    children: string[] // Array of child skill IDs
}

export interface DailyLog {
    id: string
    date: string // ISO date string
    content: string
    processedSkills: string[] // Skill IDs that were updated
    createdAt: string
}

export interface LevelingSettings {
    peerConnectionEnabled: boolean
    autoSyncEnabled: boolean
    aiModelUrl: string // Ollama or other AI model API URL
    aiModelName: string
    dailyXpGain: number // Default 10
    missedDayPenalty: number // Default 20
}

export interface LevelingProfile {
    userName: string
    createdAt: string
    totalXp: number
    skillsCount: number
}

export interface LevelingState {
    profile: LevelingProfile
    skills: Record<string, Skill> // Key is skill ID
    dailyLogs: DailyLog[]
    settings: LevelingSettings
    lastCheckDate: string // ISO date string for tracking missed days
}

const initialState: LevelingState = {
    profile: {
        userName: '',
        createdAt: new Date().toISOString(),
        totalXp: 0,
        skillsCount: 0,
    },
    skills: {},
    dailyLogs: [],
    settings: {
        peerConnectionEnabled: true,
        autoSyncEnabled: true,
        aiModelUrl: 'http://localhost:11434',
        aiModelName: 'llama2',
        dailyXpGain: 10,
        missedDayPenalty: 20,
    },
    lastCheckDate: new Date().toISOString(),
}

const levelingSlice = createSlice({
    name: 'leveling',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.profile.userName = action.payload
        },
        addSkill: (state, action: PayloadAction<Omit<Skill, 'xp' | 'level' | 'lastUpdated'>>) => {
            const skill: Skill = {
                ...action.payload,
                xp: 20, // Start with 20 XP
                level: 1,
                lastUpdated: new Date().toISOString(),
            }
            state.skills[skill.id] = skill
            state.profile.skillsCount += 1
            state.profile.totalXp += 20
        },
        updateSkill: (state, action: PayloadAction<Partial<Skill> & { id: string }>) => {
            const { id, ...updates } = action.payload
            if (state.skills[id]) {
                state.skills[id] = { ...state.skills[id], ...updates }
            }
        },
        removeSkill: (state, action: PayloadAction<string>) => {
            const skill = state.skills[action.payload]
            if (skill) {
                state.profile.totalXp -= skill.xp
                state.profile.skillsCount -= 1
                delete state.skills[action.payload]
            }
        },
        addXpToSkill: (state, action: PayloadAction<{ skillId: string; xp: number }>) => {
            const skill = state.skills[action.payload.skillId]
            if (skill) {
                const oldXp = skill.xp
                skill.xp += action.payload.xp
                skill.lastUpdated = new Date().toISOString()
                
                // Calculate level (exponential: level 1 = 20, level 2 = 30, level 3 = 40, etc.)
                let xpRequired = 20
                let level = 1
                let totalXpForLevel = 0
                
                while (totalXpForLevel + xpRequired <= skill.xp) {
                    totalXpForLevel += xpRequired
                    level += 1
                    xpRequired += 10
                }
                
                skill.level = level
                state.profile.totalXp += action.payload.xp
            }
        },
        degradeSkill: (state, action: PayloadAction<string>) => {
            const skill = state.skills[action.payload]
            if (skill) {
                const penalty = state.settings.missedDayPenalty
                skill.xp = Math.max(0, skill.xp - penalty)
                skill.lastUpdated = new Date().toISOString()
                
                // Recalculate level
                let xpRequired = 20
                let level = 1
                let totalXpForLevel = 0
                
                while (totalXpForLevel + xpRequired <= skill.xp) {
                    totalXpForLevel += xpRequired
                    level += 1
                    xpRequired += 10
                }
                
                skill.level = level
                state.profile.totalXp = Math.max(0, state.profile.totalXp - penalty)
            }
        },
        addDailyLog: (state, action: PayloadAction<Omit<DailyLog, 'id' | 'createdAt'>>) => {
            const log: DailyLog = {
                ...action.payload,
                id: `log-${Date.now()}`,
                createdAt: new Date().toISOString(),
            }
            state.dailyLogs.unshift(log) // Add to beginning
            state.lastCheckDate = new Date().toISOString()
        },
        updateSettings: (state, action: PayloadAction<Partial<LevelingSettings>>) => {
            state.settings = { ...state.settings, ...action.payload }
        },
        setLastCheckDate: (state, action: PayloadAction<string>) => {
            state.lastCheckDate = action.payload
        },
        resetLevelingState: () => initialState,
        importLevelingState: (state, action: PayloadAction<LevelingState>) => {
            return action.payload
        },
    },
})

export const {
    setUserName,
    addSkill,
    updateSkill,
    removeSkill,
    addXpToSkill,
    degradeSkill,
    addDailyLog,
    updateSettings,
    setLastCheckDate,
    resetLevelingState,
    importLevelingState,
} = levelingSlice.actions

export default levelingSlice.reducer
