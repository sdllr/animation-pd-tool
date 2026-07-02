export type ProjectType = 'series' | 'short_film' | 'pilot' | 'etc';
export type EtcSubType = 'ad' | 'mv' | 'shortform' | 'education' | 'experimental' | 'unknown';

export interface ProjectInfo {
  // Shared (used by promptBuilder)
  title: string;
  genre: string;
  artStyle: string;
  tone: string;
  targetAudience: string;
  synopsis: string;
  setting: string;
  theme: string;

  // Project type selector
  projectType?: string;
  etcSubType?: string;

  // Series-specific
  episodeCount?: string;
  episodeRuntime?: string;
  recurringStructure?: string;
  seasonGoal?: string;
  episodeThemes?: string;
  mainCharacter?: string;
  recurringCharacters?: string;

  // Short film-specific
  runtime?: string;
  emotionalGoal?: string;
  mainConflict?: string;
  keyScenes?: string;
  ending?: string;
  reversal?: string;
  emotionalArc?: string;

  // Pilot-specific
  validationPoints?: string;
  characterAppeal?: string;
  worldCore?: string;
  expansionPotential?: string;

  // Etc-specific
  contentPurpose?: string;
  coreMessage?: string;
  targetResponse?: string;
}

export interface Character {
  id: string;
  name: string;
  age: string;
  gender: string;
  role: string;
  appearance: string;
  personality: string;
  background: string;
  speechStyle: string;
  relationships: string;
}

export interface Scene {
  id: string;
  number: string;
  title: string;
  location: string;
  timeOfDay: string;
  season: string;
  mood: string;
  characters: string;
  action: string;
  cameraWork: string;
  specialEffects: string;
  dialogue: string;
  bgm: string;
  notes: string;
}

export type PromptType =
  | 'storyboard'
  | 'characterDesign'
  | 'dialogue'
  | 'sceneDirection'
  | 'fullPackage'
  | 'keyImage'
  | 'backgroundSheet'
  | 'video';

export type SimilarityLevel = 'low' | 'medium' | 'high' | 'exact';

export interface ReferenceImageInfo {
  hasImage: boolean;
  similarityLevel: SimilarityLevel;
  description: string;
}

export interface StyleGuide {
  artStyle: string;
  coloring: string;
  lineStyle: string;
  cameraRules: string;
  aspectRatio: string;
  mood: string;
  negativeStyle: string;
  negativePrompt: string;
}

export type ActiveTab = 'projects' | 'project' | 'characters' | 'scenes' | 'style' | 'output' | 'guide';

export interface SavedProject {
  id: string;
  name: string;
  updatedAt: number;
  projectInfo: ProjectInfo;
  characters: Character[];
  scenes: Scene[];
  styleGuide: StyleGuide;
}
