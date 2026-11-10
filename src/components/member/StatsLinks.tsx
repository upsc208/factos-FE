import { Activity, ExternalLink, Newspaper, Plane } from 'lucide-react';

const DASHBOARDS = [
  { uid: 'factos-system', title: '서버 상태', desc: '응답 시간 · 오류 · 크롤러 · 메모리 · CPU · 디스크', Icon: Activity },
  { uid: 'factos-community', title: '유저 · 기사', desc: '가입 · 로그인 · 응원팀 · 팀별 기사·조회수 · 번역 · 댓글·신고', Icon: Newspaper },
  { uid: 'factos-travel', title: '축구 여행', desc: '여행 글 · 제보 · 펍 · 경기장 가격', Icon: Plane },
];

/**
 * sadmin: 통계(Grafana). /grafana/는 nginx가 요청마다 sadmin인지 백엔드에 물어 보고 들여보낸다 —
 * 이 탭을 숨기는 건 화면 편의일 뿐이다
 */
export default function StatsLinks() {
  return (
    <div>
      <ul className="grid sm:grid-cols-3 gap-3">
        {DASHBOARDS.map(({ uid, title, desc, Icon }) => (
          <li key={uid}>
            <a href={`/grafana/d/${uid}`} target="_blank" rel="noopener"
              className="block h-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-gray-400 transition">
              <span className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                <Icon size={18} /> {title} <ExternalLink size={14} className="ml-auto text-gray-400" />
              </span>
              <span className="mt-1 block text-xs text-gray-500">{desc}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-gray-400">Grafana가 새 탭으로 열려요. 보기 전용이에요 — 대시보드 수정은 저장소(gen-dashboards.js)에서 해요.</p>
    </div>
  );
}
