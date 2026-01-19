/**
 * Calculate the level based on XP using a linear progression system
 * Level 1 requires 20 XP, Level 2 requires 30 XP (total 50), Level 3 requires 40 XP (total 90), etc.
 * Each level requires 10 more XP than the previous level
 */
export const calculateLevel = (xp: number): number => {
  let xpRequired = 20;
  let level = 1;
  let totalXpForLevel = 0;
  
  while (totalXpForLevel + xpRequired <= xp) {
    totalXpForLevel += xpRequired;
    level += 1;
    xpRequired += 10;
  }
  
  return level;
};

/**
 * Calculate XP required for a specific level
 */
export const getXpRequiredForLevel = (level: number): number => {
  return 20 + (level - 1) * 10;
};

/**
 * Calculate total XP needed to reach a specific level
 */
export const getTotalXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpRequiredForLevel(i);
  }
  return total;
};
