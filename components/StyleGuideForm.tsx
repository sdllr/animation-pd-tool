'use client';

import type { StyleGuide } from '@/types';

interface Props {
  data: StyleGuide;
  onChange: (data: StyleGuide) => void;
}

const ART_STYLES = ['일본 애니메이션 (셀 애니)', '웹툰풍', '아메리칸 카툰', '리얼리스틱', 'SD/치비', '수채화풍', '누아르', '레트로 70-80s', '모에계'];
const COLORING   = ['셀 채색 (플랫)', '그라데이션 채색', '수채화 채색', '에어브러시', '흑백/단색', '도트 픽셀', '텍스처 채색'];
const LINE_STYLES = ['깔끔한 단일 선', '두꺼운 아웃라인', '선 없음 (노 라인)', '스케치 느낌', '캘리그래피 선', '디지털 플랫 선'];
const ASPECT_RATIOS = ['16:9 (가로 와이드)', '9:16 (세로 숏폼)', '1:1 (정방형)', '4:3 (레트로)', '2.35:1 (시네마스코프)'];

export default function StyleGuideForm({ data, onChange }: Props) {
  const update = (key: keyof StyleGuide, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">스타일 가이드</h2>
        <p className="text-sm text-gray-500">작품 전체에 일관되게 적용되는 비주얼 규칙을 설정합니다. 프롬프트 생성 시 자동으로 반영됩니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="아트 스타일">
          <div className="flex gap-2">
            <select value={ART_STYLES.includes(data.artStyle) ? data.artStyle : ''} onChange={(e) => update('artStyle', e.target.value)} className="input-field w-auto">
              <option value="">선택</option>
              {ART_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="text" value={data.artStyle} onChange={(e) => update('artStyle', e.target.value)} placeholder="직접 입력" className="input-field flex-1" />
          </div>
        </Field>

        <Field label="채색 방식">
          <div className="flex gap-2">
            <select value={COLORING.includes(data.coloring) ? data.coloring : ''} onChange={(e) => update('coloring', e.target.value)} className="input-field w-auto">
              <option value="">선택</option>
              {COLORING.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" value={data.coloring} onChange={(e) => update('coloring', e.target.value)} placeholder="직접 입력" className="input-field flex-1" />
          </div>
        </Field>

        <Field label="선화 스타일">
          <div className="flex gap-2">
            <select value={LINE_STYLES.includes(data.lineStyle) ? data.lineStyle : ''} onChange={(e) => update('lineStyle', e.target.value)} className="input-field w-auto">
              <option value="">선택</option>
              {LINE_STYLES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <input type="text" value={data.lineStyle} onChange={(e) => update('lineStyle', e.target.value)} placeholder="직접 입력" className="input-field flex-1" />
          </div>
        </Field>

        <Field label="화면비 (Aspect Ratio)">
          <select value={data.aspectRatio} onChange={(e) => update('aspectRatio', e.target.value)} className="input-field">
            <option value="">선택</option>
            {ASPECT_RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="분위기/무드">
          <input type="text" value={data.mood} onChange={(e) => update('mood', e.target.value)} placeholder="예: 따뜻한 파스텔, 어두운 누아르, 청량한 여름" className="input-field" />
        </Field>
      </div>

      <Field label="카메라 규칙" hint="반복적으로 사용하는 카메라 앵글, 이동 방식, 구도 규칙">
        <textarea value={data.cameraRules} onChange={(e) => update('cameraRules', e.target.value)}
          placeholder="예: 캐릭터 감정 강조 시 CU 사용. 액션 씬은 로우 앵글. 전환은 항상 오른쪽 와이프."
          rows={3} className="input-field resize-none" />
      </Field>

      <div className="pt-2 border-t border-gray-200 space-y-4">
        <div>
          <p className="text-sm font-bold text-gray-800 mb-0.5">금지사항</p>
          <p className="text-xs text-gray-400">이미지/영상 생성 시 반드시 피해야 할 스타일이나 요소</p>
        </div>

        <Field label="금지 스타일" hint="이 작품에서 절대 쓰면 안 되는 표현 방식">
          <textarea value={data.negativeStyle} onChange={(e) => update('negativeStyle', e.target.value)}
            placeholder="예: 3D 렌더링, 리얼 포토그래피 느낌, 과도한 그라데이션, 고딕 폰트"
            rows={2} className="input-field resize-none" />
        </Field>

        <Field label="네거티브 프롬프트" hint="Midjourney, Stable Diffusion, Sora 등 이미지/영상 생성툴용 네거티브 텍스트">
          <textarea value={data.negativePrompt} onChange={(e) => update('negativePrompt', e.target.value)}
            placeholder="예: blurry, low quality, 3d render, realistic photo, watermark, text, signature, deformed hands, extra fingers"
            rows={3} className="input-field resize-none font-mono text-xs" />
        </Field>
      </div>

      {(data.artStyle || data.coloring || data.negativeStyle) && (
        <div className="bg-gray-100/50 border border-gray-300 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">현재 스타일 요약</p>
          <div className="flex flex-wrap gap-2">
            {data.artStyle     && <Tag>{data.artStyle}</Tag>}
            {data.coloring     && <Tag>{data.coloring}</Tag>}
            {data.lineStyle    && <Tag>{data.lineStyle}</Tag>}
            {data.aspectRatio  && <Tag>{data.aspectRatio}</Tag>}
            {data.mood         && <Tag variant="mood">{data.mood}</Tag>}
            {data.negativeStyle && <Tag variant="negative">🚫 {data.negativeStyle.slice(0, 30)}{data.negativeStyle.length > 30 ? '...' : ''}</Tag>}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'mood' | 'negative' }) {
  const cls = {
    default: 'bg-emerald-50/40 text-emerald-700 border-emerald-200/50',
    mood: 'bg-emerald-50/40 text-emerald-700 border-emerald-200/50',
    negative: 'bg-rose-50/40 text-rose-700 border-rose-200/50',
  }[variant];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>{children}</span>
  );
}
