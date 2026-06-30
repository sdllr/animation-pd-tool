export interface ProjectInfo {
  title: string;
  genre: string;
  artStyle: string;
  tone: string;
  targetAudience: string;
  synopsis: string;
  setting: string;
  theme: string;
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
  | 'fullPackage';

export type ActiveTab = 'project' | 'characters' | 'scenes' | 'output' | 'guide';
