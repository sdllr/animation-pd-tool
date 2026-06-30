'use client';

export default function GuideView() {
  return (
    <div className="space-y-10 max-w-3xl">
      {/* Title */}
      <div className="border-b border-slate-700 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white">
            PD
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI 애니메이션 PD 툴</h1>
            <p className="text-sm text-slate-400">사용 가이드 — for Claude.ai</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          이 툴은 애니메이션 제작에 필요한 정보(작품·캐릭터·씬)를 입력하면,
          Claude.ai에 붙여넣을 수 있는 최적화된 프롬프트를 자동으로 조립해주는 프로덕션 어시스턴트입니다.
        </p>
      </div>

      {/* Overview */}
      <Section title="전체 워크플로우" icon="🗺️">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          {[
            { step: '01', tab: '작품 정보', icon: '🎨', desc: '장르·스타일·시놉시스 입력' },
            { step: '02', tab: '캐릭터', icon: '👥', desc: '등장인물 상세 설정' },
            { step: '03', tab: '씬 설정', icon: '🎬', desc: '씬별 연출 정보 입력' },
            { step: '04', tab: '프롬프트 생성', icon: '✨', desc: '유형 선택 후 복사' },
          ].map((s) => (
            <div key={s.step} className="relative bg-slate-800 rounded-xl p-4 border border-slate-700">
              <span className="absolute top-3 right-3 text-xs font-bold text-slate-600">{s.step}</span>
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-sm font-semibold text-white mb-1">{s.tab}</p>
              <p className="text-xs text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
        <Callout type="info">
          각 탭은 독립적이므로 순서를 지키지 않아도 됩니다. 정보가 많을수록 프롬프트 품질이 높아집니다.
        </Callout>
      </Section>

      {/* Step 1 */}
      <Section title="1단계 — 작품 정보 입력" icon="🎨">
        <p className="text-slate-400 text-sm mb-4">
          제작할 애니메이션의 전반적인 방향성을 설정하는 단계입니다. 모든 프롬프트의 기반이 됩니다.
        </p>
        <Table
          headers={['항목', '설명', '예시']}
          rows={[
            ['작품 제목', '프롬프트 전체에 참조되는 작품명', '별빛을 삼킨 소년'],
            ['장르', '드롭다운 선택 또는 직접 입력 가능', '판타지, 로맨스, SF'],
            ['아트 스타일', '비주얼 톤을 결정하는 핵심 설정', '일본 애니메이션 (셀 애니)'],
            ['전체 톤/분위기', '작품 전반의 감정적 색채', '혼합 (밝음+어둠)'],
            ['타겟 시청자', 'Claude가 표현 수위를 조절하는 기준', '청소년 (13-18세)'],
            ['작품 배경', '세계관·시대적 배경 간략 서술', '마법이 존재하는 중세 판타지 왕국'],
            ['주제/테마', '작품이 다루는 핵심 메시지', '성장, 우정, 자아 발견'],
            ['시놉시스', '전체 줄거리 (길게 써도 무방)', '자유 서술'],
          ]}
        />
        <Callout type="tip">
          장르·아트 스타일 항목은 드롭다운과 직접 입력 칸을 동시에 제공합니다. 드롭다운 선택 후 직접 입력 칸에서 덮어쓸 수 있습니다.
        </Callout>
      </Section>

      {/* Step 2 */}
      <Section title="2단계 — 캐릭터 설정" icon="👥">
        <p className="text-slate-400 text-sm mb-4">
          등장인물을 원하는 만큼 추가하고 각각의 상세 정보를 입력합니다.
        </p>
        <ol className="space-y-2 text-sm text-slate-300 mb-4">
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">①</span><span><strong className="text-white">+ 캐릭터 추가</strong> 버튼을 클릭해 새 캐릭터를 생성합니다.</span></li>
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">②</span><span>왼쪽 목록에서 캐릭터를 선택하면 오른쪽에 편집 폼이 나타납니다.</span></li>
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">③</span><span>캐릭터 이름 옆 <strong className="text-white">✕</strong>를 클릭해 삭제할 수 있습니다.</span></li>
        </ol>
        <Table
          headers={['항목', '설명']}
          rows={[
            ['이름', '캐릭터를 특정하는 고유 식별자'],
            ['역할', '주인공·악당 등 서사적 역할 (드롭다운 제공)'],
            ['나이 / 성별', '기본 인물 정보'],
            ['말투/어조', '정중체·반말·사투리 등 (드롭다운 제공)'],
            ['외모 묘사', '헤어·체형·의상 등 캐릭터 디자인 기반 정보'],
            ['성격', '강점·약점·가치관·트라우마 등'],
            ['배경 스토리', '과거 이력·가족·현재 상황'],
            ['인물 관계', '다른 캐릭터와의 관계 서술 (씬 대사 품질에 직결)'],
          ]}
        />
      </Section>

      {/* Step 3 */}
      <Section title="3단계 — 씬 설정" icon="🎬">
        <p className="text-slate-400 text-sm mb-4">
          스토리보드·대사·연출 프롬프트 생성에 직접 사용되는 씬별 정보를 입력합니다.
        </p>
        <Table
          headers={['항목', '설명']}
          rows={[
            ['씬 번호/제목', '식별용 (예: 1, 2A, "첫 만남")'],
            ['장소/배경', '씬이 펼쳐지는 공간 (예: 학교 옥상, 마법 숲 입구)'],
            ['등장 캐릭터', '이 씬에 나오는 인물 나열'],
            ['시간대 / 계절', '조명·분위기 연출의 기준'],
            ['씬 분위기', '태그 버튼으로 빠르게 선택, 직접 입력도 가능'],
            ['카메라 워크', '팬·틸트·줌·핸드헬드 등 (드롭다운 제공)'],
            ['핵심 액션/사건', '씬의 시작→중간→끝 흐름 서술 (가장 중요)'],
            ['대사/감정 흐름', '정확한 대사 없이 방향만 적어도 무방'],
            ['특수효과 / BGM', '이펙트·사운드 연출 힌트'],
            ['PD 노트', '레퍼런스·금기사항 등 기타 지시사항'],
          ]}
        />
        <Callout type="tip">
          씬이 여러 개인 경우, 프롬프트 생성 탭에서 씬을 개별 선택해 각각 다른 프롬프트를 만들 수 있습니다.
        </Callout>
      </Section>

      {/* Step 4 */}
      <Section title="4단계 — 프롬프트 생성 및 복사" icon="✨">
        <p className="text-slate-400 text-sm mb-4">
          입력한 모든 정보를 바탕으로 Claude.ai에 최적화된 프롬프트를 자동 조립합니다.
        </p>

        <h3 className="text-sm font-semibold text-slate-200 mb-3">5가지 프롬프트 유형</h3>
        <div className="space-y-2 mb-5">
          {[
            { icon: '🎞️', name: '스토리보드', when: '컷 단위 구도·카메라·대사 지시서가 필요할 때', output: '컷 번호, 앵글, 캐릭터 위치, 카메라 무브, 대사, 이펙트' },
            { icon: '✏️', name: '캐릭터 디자인', when: '외형·컬러 팔레트·표정 시트 가이드를 요청할 때', output: '전신 묘사, 컬러코드, 표정 5종, 모션 특성, 비례 비교' },
            { icon: '💬', name: '대사/시나리오', when: '씬 스크립트와 대사를 작성받고 싶을 때', output: '씬 슬러그라인, 행동 지문, 대사, 감정 지시어, 나레이션' },
            { icon: '🎬', name: '씬 연출 노트', when: 'PD 관점의 연출 전략과 방향이 필요할 때', output: '감정 목표, 카메라 전략, 색채/조명, 편집 리듬, 레퍼런스' },
            { icon: '📦', name: '전체 패키지', when: '첫 기획 단계에서 종합 프로덕션 가이드가 필요할 때', output: '작품 분석, 비주얼 콘셉트, 캐릭터 정리, 씬별 플랜, 제작 우선순위' },
          ].map((pt) => (
            <div key={pt.name} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{pt.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-1">{pt.name}</p>
                  <p className="text-xs text-slate-400 mb-1.5"><span className="text-slate-500">언제: </span>{pt.when}</p>
                  <p className="text-xs text-slate-500"><span className="text-slate-600">출력 내용: </span>{pt.output}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-slate-200 mb-3">복사 및 사용 절차</h3>
        <ol className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">①</span><span>원하는 프롬프트 유형 아이콘을 클릭합니다.</span></li>
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">②</span><span>씬별 프롬프트라면 <strong className="text-white">대상 씬</strong> 드롭다운에서 씬을 선택합니다.</span></li>
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">③</span><span>미리보기 영역에서 생성된 프롬프트를 확인합니다.</span></li>
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">④</span><span><strong className="text-white">클립보드에 복사</strong> 버튼을 클릭합니다.</span></li>
          <li className="flex gap-3"><span className="text-violet-400 font-bold flex-shrink-0">⑤</span><span><strong className="text-white">claude.ai</strong> 채팅창에 붙여넣기(<code className="bg-slate-700 px-1 rounded text-xs">Ctrl+V</code>)하고 전송합니다.</span></li>
        </ol>
      </Section>

      {/* Tips */}
      <Section title="Claude.ai 활용 팁" icon="💡">
        <div className="space-y-3">
          {[
            { title: '결과 다듬기', desc: '답변이 마음에 들지 않으면 "더 감동적으로 수정해줘" 또는 "3번 컷을 슬로우 모션으로 바꿔줘"처럼 이어서 요청하세요.' },
            { title: '씬별 반복 생성', desc: '씬을 여러 개 등록해두고 대상 씬만 바꿔가며 같은 유형의 프롬프트를 반복 생성할 수 있습니다.' },
            { title: '유형 조합 활용', desc: '같은 씬에 대해 스토리보드 → 대사/시나리오 순서로 두 번 생성하면 비주얼과 대사를 각각 다듬을 수 있습니다.' },
            { title: '전체 패키지 우선', desc: '처음 기획 단계라면 전체 패키지 프롬프트로 Claude에게 방향 피드백을 받은 뒤, 씬별 프롬프트로 진행하는 것을 권장합니다.' },
            { title: '토큰 안내', desc: '프롬프트 미리보기 하단에 예상 토큰 수가 표시됩니다. Claude.ai 무료 플랜도 충분히 처리 가능한 수준입니다.' },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3">
              <span className="text-violet-400 mt-0.5">▸</span>
              <div>
                <span className="text-sm font-semibold text-white">{tip.title}: </span>
                <span className="text-sm text-slate-400">{tip.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* Sub-components */

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800 pb-2">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-800/50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 ${j === 0 ? 'font-medium text-slate-200 whitespace-nowrap' : 'text-slate-400'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ type, children }: { type: 'tip' | 'info'; children: React.ReactNode }) {
  const styles = {
    tip: 'bg-amber-950/40 border-amber-700/40 text-amber-300',
    info: 'bg-blue-950/40 border-blue-700/40 text-blue-300',
  };
  const labels = { tip: '💡 Tip', info: 'ℹ️ 참고' };
  return (
    <div className={`mt-4 px-4 py-3 rounded-xl border text-xs leading-relaxed ${styles[type]}`}>
      <span className="font-semibold mr-2">{labels[type]}</span>
      {children}
    </div>
  );
}
