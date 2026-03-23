export enum QuestType {
  Story = "story",
  Side = "side",
  Daily = "daily",
  Weekly = "weekly",
  Guild = "guild",
  Achievement = "achievement",
}

export enum ObjectiveType {
  Kill = "kill",
  Collect = "collect",
  Interact = "interact",
  ReachLocation = "reach_location",
  CompleteInstance = "complete_instance",
  SkillLevel = "skill_level",
}

export interface QuestObjective {
  type: ObjectiveType;
  targetId: string;
  targetCount: number;
  description: string;
}

export interface QuestRewardItem {
  itemId: string;
  quantity: number;
}

export interface QuestRewardSkillXp {
  skillId: string;
  amount: number;
}

export interface QuestRewardReputation {
  factionId: string;
  amount: number;
}

export interface QuestRewardCurrency {
  currencyId: string;
  amount: number;
}

export interface QuestRewards {
  xp: number;
  currency: QuestRewardCurrency[];
  items: QuestRewardItem[];
  skillXp?: QuestRewardSkillXp[];
  reputation?: QuestRewardReputation[];
  unlocks?: string[];
}

export interface QuestDialogue {
  offer: string;
  inProgress: string;
  complete: string;
}

export interface QuestDefinition {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  levelRequirement: number;
  classRequirement?: string;
  prerequisiteQuests: string[];
  repeatable: boolean;
  resetPeriod?: string;
  objectives: QuestObjective[];
  rewards: QuestRewards;
  dialogue: QuestDialogue;
}

export type QuestStatus = "available" | "active" | "completed" | "failed";

export interface ObjectiveProgress {
  objectiveIndex: number;
  currentCount: number;
  isComplete: boolean;
}

export interface CharacterQuest {
  characterId: string;
  questId: string;
  status: QuestStatus;
  objectiveProgress: ObjectiveProgress[];
  acceptedAt?: number;
  completedAt?: number;
  lastReset?: number;
}
