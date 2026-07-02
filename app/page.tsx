'use client';

import { useState, useEffect, useRef } from 'react';
import type { ProjectInfo, Character, Scene, StyleGuide, ActiveTab, SavedProject } from '@/types';
import ProjectInfoForm from '@/components/ProjectInfoForm';
import CharacterManager from '@/components/CharacterManager';
import SceneManager from '@/components/SceneManager';
import StyleGuideForm from '@/components/StyleGuideForm';
import PromptOutput from '@/components/PromptOutput';
import GuideView from '@/components/GuideView';
import ProjectManager from '@/components/ProjectManager';

const STORAGE_KEY = 'anim-pd-save';
const PROJECTS_KEY = 'anim-pd-projects';
const CURRENT_PROJECT_ID_KEY = 'anim-pd-current-project-id';

function makeProjectId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── PDF Korean font (loaded lazily, cached across exports) ──────────────────
const PDF_FONT = 'MalgunGothic';
let pdfFontBase64: { regular: string; bold: string } | null = null;

function arrayBufferToBase64(buf: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function loadPdfFonts() {
  if (pdfFontBase64) return pdfFontBase64;
  const [regularBuf, boldBuf] = await Promise.all([
    fetch('/fonts/MalgunGothic-Regular.ttf').then((r) => r.arrayBuffer()),
    fetch('/fonts/MalgunGothic-Bold.ttf').then((r) => r.arrayBuffer()),
  ]);
  pdfFontBase64 = {
    regular: arrayBufferToBase64(regularBuf),
    bold: arrayBufferToBase64(boldBuf),
  };
  return pdfFontBase64;
}

const defaultStyleGuide: StyleGuide = {
  artStyle: '',
  coloring: '',
  lineStyle: '',
  cameraRules: '',
  aspectRatio: '',
  mood: '',
  negativeStyle: '',
  negativePrompt: '',
};

const defaultProject: ProjectInfo = {
  title: '',
  genre: '',
  artStyle: '',
  tone: '',
  targetAudience: '',
  synopsis: '',
  setting: '',
  theme: '',
  projectType: '',
};

const NAV_TABS: { id: ActiveTab; label: string; icon: string }[] = [
  { id: 'projects',   label: '내 프로젝트',   icon: '📁' },
  { id: 'project',    label: '기획 시작',    icon: '🎨' },
  { id: 'characters', label: '캐릭터',       icon: '👥' },
  { id: 'scenes',     label: '씬 설정',      icon: '🎬' },
  { id: 'style',      label: '스타일 가이드', icon: '🖌️' },
  { id: 'output',     label: '프롬프트 생성', icon: '✨' },
  { id: 'guide',      label: '사용 가이드',  icon: '📋' },
];

function getCompletionColor(pct: number) {
  if (pct >= 70) return 'bg-emerald-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

function projectCompletion(p: ProjectInfo): number {
  const fields = [p.projectType, p.title, p.genre, p.tone, p.synopsis];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default function Home() {
  const [activeTab, setActiveTab]       = useState<ActiveTab>('project');
  const [projectInfo, setProjectInfo]   = useState<ProjectInfo>(defaultProject);
  const [characters, setCharacters]     = useState<Character[]>([]);
  const [scenes, setScenes]             = useState<Scene[]>([]);
  const [styleGuide, setStyleGuide]     = useState<StyleGuide>(defaultStyleGuide);

  // Save state
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving]       = useState(false);
  const hasHydrated                   = useRef(false);

  // Saved projects (multi-project management)
  const [projects, setProjects]                 = useState<SavedProject[]>([]);
  const [currentProjectId, setCurrentProjectId]  = useState<string | null>(null);

  // ── Load from localStorage on mount ──────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.projectInfo) setProjectInfo(saved.projectInfo);
        if (saved.characters)  setCharacters(saved.characters);
        if (saved.scenes)      setScenes(saved.scenes);
        if (saved.styleGuide)  setStyleGuide(saved.styleGuide);
      }
      const rawProjects = localStorage.getItem(PROJECTS_KEY);
      if (rawProjects) setProjects(JSON.parse(rawProjects));
      const rawCurrentId = localStorage.getItem(CURRENT_PROJECT_ID_KEY);
      if (rawCurrentId) setCurrentProjectId(rawCurrentId);
    } catch {}
    // Delay flag so auto-save doesn't fire with empty state during hydration
    setTimeout(() => { hasHydrated.current = true; }, 0);
  }, []);

  // ── Auto-save (800 ms debounce) ───────────────────────────────────────────
  useEffect(() => {
    if (!hasHydrated.current) return;
    setIsSaving(true);
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ projectInfo, characters, scenes, styleGuide }));
      } catch {}
      setLastSavedAt(new Date());
      setIsSaving(false);
    }, 800);
    return () => clearTimeout(t);
  }, [projectInfo, characters, scenes, styleGuide]);

  // ── Persist saved-project list & current project pointer ─────────────────
  useEffect(() => {
    if (!hasHydrated.current) return;
    try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); } catch {}
  }, [projects]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      if (currentProjectId) localStorage.setItem(CURRENT_PROJECT_ID_KEY, currentProjectId);
      else localStorage.removeItem(CURRENT_PROJECT_ID_KEY);
    } catch {}
  }, [currentProjectId]);

  // ── Saved-project CRUD ─────────────────────────────────────────────────────
  const handleSaveAsNewProject = (name: string) => {
    const project: SavedProject = {
      id: makeProjectId(),
      name,
      updatedAt: Date.now(),
      projectInfo, characters, scenes, styleGuide,
    };
    setProjects((prev) => [...prev, project]);
    setCurrentProjectId(project.id);
  };

  const handleUpdateCurrentProject = () => {
    if (!currentProjectId) return;
    setProjects((prev) => prev.map((p) => (
      p.id === currentProjectId
        ? { ...p, projectInfo, characters, scenes, styleGuide, updatedAt: Date.now() }
        : p
    )));
  };

  const handleLoadProject = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    setProjectInfo(project.projectInfo);
    setCharacters(project.characters);
    setScenes(project.scenes);
    setStyleGuide(project.styleGuide);
    setCurrentProjectId(id);
    setActiveTab('project');
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProjectId === id) setCurrentProjectId(null);
  };

  const handleRenameProject = (id: string, name: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const [showExportMenu, setShowExportMenu] = useState(false);

  const baseFilename = `${projectInfo.title || '기획안'}_${new Date().toISOString().slice(0, 10)}`;

  const handleExportJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ projectInfo, characters, scenes, styleGuide }, null, 2)],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = `${baseFilename}.json`; a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportMD = () => {
    const p = projectInfo;
    const lines: string[] = [
      `# ${p.title || '(제목 없음)'}`,
      '',
      '## 작품 기본 정보',
      p.genre          ? `- **장르**: ${p.genre}` : '',
      p.tone           ? `- **톤**: ${p.tone}` : '',
      p.targetAudience ? `- **타겟**: ${p.targetAudience}` : '',
      p.synopsis       ? `\n### 시놉시스\n${p.synopsis}` : '',
      p.setting        ? `\n### 배경\n${p.setting}` : '',
      p.theme          ? `\n### 주제\n${p.theme}` : '',
      '',
    ];

    if (characters.length > 0) {
      lines.push('## 캐릭터');
      characters.forEach((c) => {
        lines.push(`\n### ${c.name || '(이름 없음)'}`);
        if (c.age)          lines.push(`- **나이**: ${c.age}`);
        if (c.gender)       lines.push(`- **성별**: ${c.gender}`);
        if (c.role)         lines.push(`- **역할**: ${c.role}`);
        if (c.appearance)   lines.push(`- **외모**: ${c.appearance}`);
        if (c.personality)  lines.push(`- **성격**: ${c.personality}`);
        if (c.background)   lines.push(`- **배경**: ${c.background}`);
        if (c.speechStyle)  lines.push(`- **말투**: ${c.speechStyle}`);
        if (c.relationships) lines.push(`- **관계**: ${c.relationships}`);
      });
      lines.push('');
    }

    if (scenes.length > 0) {
      lines.push('## 씬 목록');
      scenes.forEach((s) => {
        lines.push(`\n### #${s.number || '?'} ${s.title || '(제목 없음)'}`);
        if (s.location)      lines.push(`- **장소**: ${s.location}`);
        if (s.timeOfDay)     lines.push(`- **시간대**: ${s.timeOfDay}`);
        if (s.season)        lines.push(`- **계절**: ${s.season}`);
        if (s.mood)          lines.push(`- **분위기**: ${s.mood}`);
        if (s.characters)    lines.push(`- **등장인물**: ${s.characters}`);
        if (s.action)        lines.push(`- **액션**: ${s.action}`);
        if (s.cameraWork)    lines.push(`- **카메라**: ${s.cameraWork}`);
        if (s.dialogue)      lines.push(`- **대사**: ${s.dialogue}`);
        if (s.bgm)           lines.push(`- **BGM**: ${s.bgm}`);
        if (s.notes)         lines.push(`- **메모**: ${s.notes}`);
      });
      lines.push('');
    }

    const sg = styleGuide;
    if (sg.artStyle || sg.coloring || sg.lineStyle) {
      lines.push('## 스타일 가이드');
      if (sg.artStyle)       lines.push(`- **아트 스타일**: ${sg.artStyle}`);
      if (sg.coloring)       lines.push(`- **채색**: ${sg.coloring}`);
      if (sg.lineStyle)      lines.push(`- **선 스타일**: ${sg.lineStyle}`);
      if (sg.cameraRules)    lines.push(`- **카메라 룰**: ${sg.cameraRules}`);
      if (sg.aspectRatio)    lines.push(`- **화면 비율**: ${sg.aspectRatio}`);
      if (sg.mood)           lines.push(`- **무드**: ${sg.mood}`);
      if (sg.negativeStyle)  lines.push(`- **금지 스타일**: ${sg.negativeStyle}`);
      if (sg.negativePrompt) lines.push(`- **네거티브 프롬프트**: ${sg.negativePrompt}`);
    }

    const md = lines.filter(l => l !== undefined).join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${baseFilename}.md`; a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportPDF = async () => {
    const [{ jsPDF }, fonts] = await Promise.all([import('jspdf'), loadPdfFonts()]);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    doc.addFileToVFS('MalgunGothic-Regular.ttf', fonts.regular);
    doc.addFont('MalgunGothic-Regular.ttf', PDF_FONT, 'normal');
    doc.addFileToVFS('MalgunGothic-Bold.ttf', fonts.bold);
    doc.addFont('MalgunGothic-Bold.ttf', PDF_FONT, 'bold');
    doc.setFont(PDF_FONT, 'normal');

    const pageW = 210;
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = margin;

    const checkPage = (needed = 8) => {
      if (y + needed > 280) { doc.addPage(); y = margin; }
    };

    const writeText = (text: string, size: number, color: [number,number,number], bold = false, indent = 0) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.setFont(PDF_FONT, bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, contentW - indent);
      checkPage(lines.length * (size * 0.4));
      doc.text(lines, margin + indent, y);
      y += lines.length * (size * 0.4) + 2;
    };

    const writeRow = (label: string, value: string) => {
      if (!value) return;
      checkPage(10);
      doc.setFontSize(9);
      doc.setFont(PDF_FONT, 'bold');
      doc.setTextColor(80, 120, 80);
      doc.text(label + ': ', margin + 2, y);
      const labelW = doc.getTextWidth(label + ': ');
      doc.setFont(PDF_FONT, 'normal');
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(value, contentW - labelW - 4);
      doc.text(lines, margin + 2 + labelW, y);
      y += lines.length * 4.5 + 1.5;
    };

    const drawSection = (title: string) => {
      checkPage(14);
      y += 4;
      doc.setFillColor(210, 240, 215);
      doc.roundedRect(margin, y - 5, contentW, 9, 2, 2, 'F');
      writeText(title, 11, [30, 100, 50], true);
      y += 1;
    };

    const p = projectInfo;

    // Title
    doc.setFillColor(180, 230, 190);
    doc.roundedRect(margin, y - 4, contentW, 14, 3, 3, 'F');
    writeText(p.title || '(제목 없음)', 16, [20, 80, 40], true);
    y += 4;

    // 기본 정보
    drawSection('작품 기본 정보');
    writeRow('장르', p.genre);
    writeRow('톤', p.tone);
    writeRow('타겟', p.targetAudience);
    writeRow('배경', p.setting);
    writeRow('주제', p.theme);
    if (p.synopsis) { writeRow('시놉시스', p.synopsis); }

    // 캐릭터
    if (characters.length > 0) {
      drawSection(`캐릭터 (${characters.length}명)`);
      characters.forEach((c) => {
        checkPage(12);
        writeText(`▸ ${c.name || '(이름 없음)'}`, 10, [30, 90, 50], true, 2);
        writeRow('역할', c.role);
        writeRow('나이/성별', [c.age, c.gender].filter(Boolean).join(' · '));
        writeRow('외모', c.appearance);
        writeRow('성격', c.personality);
        writeRow('배경', c.background);
        writeRow('말투', c.speechStyle);
        writeRow('관계', c.relationships);
        y += 2;
      });
    }

    // 씬
    if (scenes.length > 0) {
      drawSection(`씬 목록 (${scenes.length}개)`);
      scenes.forEach((s) => {
        checkPage(12);
        writeText(`#${s.number || '?'} ${s.title || '(제목 없음)'}`, 10, [30, 90, 50], true, 2);
        writeRow('장소', s.location);
        writeRow('시간/계절', [s.timeOfDay, s.season].filter(Boolean).join(' · '));
        writeRow('분위기', s.mood);
        writeRow('등장인물', s.characters);
        writeRow('액션', s.action);
        writeRow('카메라', s.cameraWork);
        writeRow('대사', s.dialogue);
        writeRow('BGM', s.bgm);
        writeRow('메모', s.notes);
        y += 2;
      });
    }

    // 스타일 가이드
    if (styleGuide.artStyle) {
      drawSection('스타일 가이드');
      writeRow('아트 스타일', styleGuide.artStyle);
      writeRow('채색', styleGuide.coloring);
      writeRow('선 스타일', styleGuide.lineStyle);
      writeRow('화면 비율', styleGuide.aspectRatio);
      writeRow('무드', styleGuide.mood);
      writeRow('카메라 룰', styleGuide.cameraRules);
      writeRow('금지 스타일', styleGuide.negativeStyle);
    }

    doc.save(`${baseFilename}.pdf`);
    setShowExportMenu(false);
  };

  // ── Import JSON ───────────────────────────────────────────────────────────
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const saved = JSON.parse(reader.result as string);
        if (saved.projectInfo) setProjectInfo(saved.projectInfo);
        if (saved.characters)  setCharacters(saved.characters);
        if (saved.scenes)      setScenes(saved.scenes);
        if (saved.styleGuide)  setStyleGuide(saved.styleGuide);
        setCurrentProjectId(null);
      } catch {
        alert('파일을 불러올 수 없습니다. 올바른 JSON 파일인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const projPct = projectCompletion(projectInfo);

  return (
    <div className="min-h-screen flex flex-col" style={{background: 'var(--background)'}}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-gray-50/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white">
              PD
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">AI 애니메이션 PD 툴</h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">for Claude.ai</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 text-xs text-gray-500 min-w-0">
            {/* Save status */}
            <div className="hidden sm:flex items-center gap-2">
              {isSaving ? (
                <span className="text-gray-300">저장 중...</span>
              ) : lastSavedAt ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {lastSavedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 저장됨
                </span>
              ) : null}

              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu((v) => !v)}
                  className="px-2 py-1 rounded border border-gray-300 hover:border-gray-300 hover:text-gray-800 transition-colors"
                >
                  내보내기 ▾
                </button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 mt-1 w-36 bg-gray-100 border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden">
                      <button onClick={handleExportMD}   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors">📝 Markdown</button>
                      <button onClick={handleExportPDF}  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors">🖨️ PDF (인쇄)</button>
                      <button onClick={handleExportJSON} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors">📄 JSON (백업)</button>
                    </div>
                  </>
                )}
              </div>

              {/* Import */}
              <label
                title="JSON 파일 불러오기"
                className="px-2 py-1 rounded border border-gray-300 hover:border-gray-300 hover:text-gray-800 transition-colors cursor-pointer"
              >
                불러오기
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>

            {/* Stats */}
            <span className="hidden sm:block">
              캐릭터 <strong className="text-gray-900">{characters.length}</strong>명 ·{' '}
              씬 <strong className="text-gray-900">{scenes.length}</strong>개
            </span>

            {/* Completion bar */}
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-48 flex-shrink-0 gap-1">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
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
          <div className="mt-6 p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-200">
            <p className="text-xs font-semibold text-gray-400">현황</p>
            <div className="space-y-1">
              <StatRow label="기획 완성도" value={`${projPct}%`}          highlight={projPct >= 70} />
              <StatRow label="캐릭터"      value={`${characters.length}명`} highlight={characters.length > 0} />
              <StatRow label="씬"          value={`${scenes.length}개`}    highlight={scenes.length > 0} />
            </div>
          </div>

          {/* Mobile save buttons (visible in sidebar area on sm-md) */}
          <div className="mt-4 flex flex-col gap-2 md:hidden">
            <button onClick={handleExportMD}   className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">📝 MD 내보내기</button>
            <button onClick={handleExportPDF}  className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">🖨️ PDF 내보내기</button>
            <button onClick={handleExportJSON} className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">📄 JSON 내보내기</button>
            <label className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-center">
              📥 불러오기
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 mb-16 md:mb-0">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 min-h-full">
            {activeTab === 'projects' && (
              <ProjectManager
                projects={projects}
                currentProjectId={currentProjectId}
                currentTitle={projectInfo.title}
                onSaveAsNew={handleSaveAsNewProject}
                onUpdateCurrent={handleUpdateCurrentProject}
                onLoad={handleLoadProject}
                onDelete={handleDeleteProject}
                onRename={handleRenameProject}
              />
            )}
            {activeTab === 'project' && (
              <ProjectInfoForm data={projectInfo} onChange={setProjectInfo} />
            )}
            {activeTab === 'characters' && (
              <CharacterManager characters={characters} onChange={setCharacters} />
            )}
            {activeTab === 'scenes' && (
              <SceneManager scenes={scenes} onChange={setScenes} />
            )}
            {activeTab === 'style' && (
              <StyleGuideForm data={styleGuide} onChange={setStyleGuide} />
            )}
            {activeTab === 'output' && (
              <PromptOutput
                projectInfo={projectInfo}
                characters={characters}
                scenes={scenes}
                styleGuide={styleGuide}
                onNavigate={setActiveTab}
              />
            )}
            {activeTab === 'guide' && <GuideView />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 flex z-50">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400'
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
      <span className="text-gray-400">{label}</span>
      <span className={highlight ? 'text-emerald-600 font-semibold' : 'text-gray-500'}>{value}</span>
    </div>
  );
}
