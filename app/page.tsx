'use client';

import { useState } from 'react';
import type { ProjectInfo, Character, Scene, ActiveTab } from '@/types';
import ProjectInfoForm from '@/components/ProjectInfoForm';
import CharacterManager from '@/components/CharacterManager';
import SceneManager from '@/components/SceneManager';
import PromptOutput from '@/components/PromptOutput';
import GuideView from '@/components/GuideView';

const defaultProject: ProjectInfo = {
  title: '',
  genre: '',
  artStyle: '',
  tone: '',
  targetAudience: '',
  synopsis: '',
  setting: '',
  theme: '',
};

const NAV_TABS: { id: ActiveTab; label: string; icon: string }[] = [
  { id: 'project', label: '작품 정보', icon: '🎨' },
  { id: 'characters', label: '캐릭터', icon: '👥' },
  { id: 'scenes', label: '씬 설정', icon: '🎬' },
  { id: 'output', label: '프롬프트 생성', icon: '✨' },
  { id: 'guide', label: '사용 가이드', icon: '📋' },
];

function getCompletionColor(pct: number) {
  if (pct >= 70) return 'bg-emerald-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

function projectCompletion(p: ProjectInfo): number {
  const fields = [p.title, p.genre, p.artStyle, p.tone, p.synopsis];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('project');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(defaultProject);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);

  const projPct = projectCompletion(projectInfo);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
              PD
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">AI 애니메이션 PD 툴</h1>
              <p className="text-xs text-slate-500 leading-none mt-0.5">for Claude.ai</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="hidden sm:block">
              캐릭터 <strong className="text-white">{characters.length}</strong>명 ·{' '}
              씬 <strong className="text-white">{scenes.length}</strong>개
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getCompletionColor(projPct)}`}
                  style={{ width: `${projPct}%` }}
                />
              </div>
              <span>{projPct}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-48 flex-shrink-0 gap-1">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
              {tab.id === 'output' && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              )}
            </button>
          ))}

          {/* Quick stats */}
          <div className="mt-6 p-3 bg-slate-900 rounded-xl space-y-2 border border-slate-800">
            <p className="text-xs font-semibold text-slate-500">현황</p>
            <div className="space-y-1">
              <StatRow label="작품 완성도" value={`${projPct}%`} highlight={projPct >= 70} />
              <StatRow label="캐릭터" value={`${characters.length}명`} highlight={characters.length > 0} />
              <StatRow label="씬" value={`${scenes.length}개`} highlight={scenes.length > 0} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 mb-16 md:mb-0">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-full">
            {activeTab === 'project' && (
              <ProjectInfoForm data={projectInfo} onChange={setProjectInfo} />
            )}
            {activeTab === 'characters' && (
              <CharacterManager characters={characters} onChange={setCharacters} />
            )}
            {activeTab === 'scenes' && (
              <SceneManager scenes={scenes} onChange={setScenes} />
            )}
            {activeTab === 'output' && (
              <PromptOutput
                projectInfo={projectInfo}
                characters={characters}
                scenes={scenes}
              />
            )}
            {activeTab === 'guide' && <GuideView />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex z-50">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id ? 'text-violet-400' : 'text-slate-500'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="truncate px-1">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={highlight ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>{value}</span>
    </div>
  );
}
