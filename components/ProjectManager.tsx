'use client';

import { useState } from 'react';
import type { SavedProject } from '@/types';

interface Props {
  projects: SavedProject[];
  currentProjectId: string | null;
  currentTitle: string;
  onSaveAsNew: (name: string) => void;
  onUpdateCurrent: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

export default function ProjectManager({
  projects, currentProjectId, currentTitle,
  onSaveAsNew, onUpdateCurrent, onLoad, onDelete, onRename,
}: Props) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const currentProject = projects.find((p) => p.id === currentProjectId) ?? null;

  const handleSaveAsNew = () => {
    const name = newName.trim() || currentTitle || '제목 없는 기획안';
    onSaveAsNew(name);
    setNewName('');
  };

  const startEditing = (p: SavedProject) => {
    setEditingId(p.id);
    setEditingName(p.name);
  };

  const commitRename = (id: string) => {
    const name = editingName.trim();
    if (name) onRename(id, name);
    setEditingId(null);
  };

  const handleDelete = (p: SavedProject) => {
    if (confirm(`"${p.name}" 프로젝트를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) {
      onDelete(p.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">내 프로젝트</h2>
        <p className="text-sm text-gray-500">현재 작업 중인 기획안을 저장하거나, 저장해둔 프로젝트를 불러와 이어서 작업하세요.</p>
      </div>

      {/* Save current draft */}
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">현재 작업 중인 기획안 저장</p>
        {currentProject && (
          <p className="text-xs text-emerald-700">
            현재 &ldquo;{currentProject.name}&rdquo; 프로젝트를 불러와 편집 중입니다.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={currentTitle || '새 프로젝트 이름'}
            className="input-field flex-1"
          />
          <div className="flex gap-2 flex-shrink-0">
            {currentProject && (
              <button
                onClick={onUpdateCurrent}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors whitespace-nowrap"
              >
                현재 프로젝트에 덮어쓰기
              </button>
            )}
            <button
              onClick={handleSaveAsNew}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors whitespace-nowrap"
            >
              + 새 프로젝트로 저장
            </button>
          </div>
        </div>
      </div>

      {/* Saved project list */}
      {projects.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <div className="text-4xl mb-3">📁</div>
          <p>아직 저장된 프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...projects].sort((a, b) => b.updatedAt - a.updatedAt).map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                p.id === currentProjectId ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                {editingId === p.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => commitRename(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(p.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="input-field text-sm py-1"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(p.updatedAt)} · 캐릭터 {p.characters.length}명 · 씬 {p.scenes.length}개
                </p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onLoad(p.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                >
                  불러오기
                </button>
                <button
                  onClick={() => startEditing(p)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  이름 수정
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
