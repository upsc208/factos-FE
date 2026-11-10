'use client';

import { useCallback, useEffect, useState } from 'react';
import { Beer, LocateFixed } from 'lucide-react';
import { CLUBS } from '@/config/clubs';
import { ApiError } from '@/lib/member';
import {
  fetchAreas, fetchPubsNear, fetchStadiumGuide, fetchWatchSpots,
  type Area, type PubRow, type StadiumGuide, type WatchSpots,
} from '@/lib/travel';
import PubCard from './PubCard';

type Mode = 'stadium' | 'watch' | 'near';

const chip = (active: boolean) =>
  `px-3 h-8 rounded-lg text-xs font-bold border transition ${
    active ? 'text-white border-transparent' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
  }`;

const PAGE = 20;

/** 펍 목록. 런던처럼 수백 곳이면 20곳씩 더 본다 */
function PubList({ pubs, clubId, empty }: { pubs: PubRow[]; clubId: string; empty: string }) {
  const [shown, setShown] = useState(PAGE);
  if (pubs.length === 0) return <p className="py-10 text-center text-sm text-gray-400">{empty}</p>;
  return (
    <>
      <ul className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
        {pubs.slice(0, shown).map((p) => <PubCard key={p.id} pub={p} clubId={clubId} />)}
      </ul>
      {pubs.length > shown && (
        <button type="button" onClick={() => setShown((n) => n + PAGE)}
          className="mt-2 w-full h-10 rounded-xl text-sm font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
          더 보기 ({pubs.length - shown}곳 더)
        </button>
      )}
    </>
  );
}

/**
 * 펍 찾기 — 한국에서 온 축구 여행자 기준
 * - 경기장 근처: 킥오프 전후로 갈 곳
 * - 경기장 못 갈 때: 영국 어디든 이 팀 팬 펍 + 스포츠 중계하는 펍 (도시별)
 * - 내 근처: 브라우저 위치로 (약 1km 단위로만 보낸다)
 */
export default function PubFinder({ clubId }: { clubId: string }) {
  const club = CLUBS[clubId];
  const [mode, setMode] = useState<Mode>('stadium');
  const [guide, setGuide] = useState<StadiumGuide | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  // 못 갈 때 볼 지역. 고르기 전엔 경기장 도시 (''는 "전체")
  const [picked, setPicked] = useState<string | null>(null);
  const city = picked ?? guide?.stadium.city ?? '';
  const [watch, setWatch] = useState<WatchSpots | null>(null);
  const [near, setNear] = useState<PubRow[] | null>(null);
  const [footballOnly, setFootballOnly] = useState(true);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchStadiumGuide(clubId, 1500).then(setGuide).catch((e) => setError(e instanceof ApiError ? e.message : '펍을 불러오지 못했어요.'));
    fetchAreas().then(setAreas).catch(() => setAreas([]));
  }, [clubId]);

  useEffect(() => {
    if (mode !== 'watch' || (picked === null && !guide)) return;
    fetchWatchSpots(clubId, city || undefined).then(setWatch).catch(() => setWatch(null));
  }, [mode, clubId, city, picked, guide]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치를 지원하지 않아요.');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchPubsNear(pos.coords.latitude, pos.coords.longitude, { club: clubId, football: footballOnly })
          .then(setNear)
          .catch((e) => setError(e instanceof ApiError ? e.message : '펍을 찾지 못했어요.'))
          .finally(() => setLocating(false));
      },
      () => {
        setError('위치를 가져오지 못했어요. 브라우저 위치 권한을 확인해 주세요.');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [clubId, footballOnly]);

  const noData = areas.length > 0 && areas.every((a) => a.pubCount === 0);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {([['stadium', '경기장 근처'], ['watch', '경기장 못 갈 때'], ['near', '내 근처']] as const).map(([m, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={chip(mode === m)}
            style={mode === m ? { backgroundColor: 'var(--primary)' } : undefined}>
            {label}
          </button>
        ))}
      </div>

      {noData && (
        <p className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-sm text-amber-700 dark:text-amber-400">
          펍 목록을 받아 오는 중이에요. 잠시 뒤에 다시 봐 주세요.
        </p>
      )}
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {mode === 'stadium' && guide && (
        <>
          <p className="mb-2 text-sm text-gray-500">{guide.stadium.nameKo}에서 {guide.radiusMeters / 1000}km 안 · {club?.nameKo} 팬 펍과 중계하는 곳이 먼저 나와요</p>
          <PubList pubs={guide.pubs} clubId={clubId} empty="아직 등록된 펍이 없어요." />
        </>
      )}

      {mode === 'watch' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <button type="button" onClick={() => setPicked('')} className={chip(city === '')} style={city === '' ? { backgroundColor: 'var(--primary)' } : undefined}>전체</button>
            {areas.map((a) => (
              <button key={a.id} type="button" onClick={() => setPicked(a.id)} className={chip(city === a.id)}
                style={city === a.id ? { backgroundColor: 'var(--primary)' } : undefined}>
                {a.nameKo}
              </button>
            ))}
          </div>
          {watch && (
            <>
              <h3 className="mt-2 font-bold text-gray-900 dark:text-white">{club?.nameKo} 팬이 모이는 펍</h3>
              <PubList key={`fan-${city}`} pubs={watch.fanPubs} clubId={clubId} empty={`아직 알려진 ${club?.nameKo} 팬 펍이 없어요. 아는 곳이 있다면 펍 카드에서 알려 주세요.`} />
              <h3 className="mt-8 font-bold text-gray-900 dark:text-white">스포츠 중계하는 펍</h3>
              <PubList key={`tv-${city}`} pubs={watch.footballPubs} clubId={clubId} empty="중계 정보가 있는 펍이 없어요. 지도 정보에 중계 여부가 적힌 곳만 나와요 — 아는 곳이 있다면 알려 주세요." />
            </>
          )}
        </>
      )}

      {mode === 'near' && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button type="button" onClick={locate} disabled={locating}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: 'var(--primary)' }}>
              <LocateFixed size={16} /> {locating ? '찾는 중…' : '내 위치로 찾기'}
            </button>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              <input type="checkbox" checked={footballOnly} onChange={(e) => setFootballOnly(e.target.checked)} /> 중계·팬 펍만
            </label>
          </div>
          <p className="mb-2 text-xs text-gray-400">위치는 약 1km 단위로만 보내고 저장하지 않아요. 3km 안을 찾아요.</p>
          {near && <PubList pubs={near} clubId={clubId} empty="3km 안에 찾은 펍이 없어요. '중계·팬 펍만'을 끄고 다시 찾아보세요." />}
        </>
      )}

      <section className="mt-12 p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-600 dark:text-gray-400">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3"><Beer size={18} style={{ color: 'var(--primary)' }} /> 영국 펍 이용 팁</h3>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>경기장 근처 펍은 경기일에 홈 팬만 받는 곳이 많아요. 상대 팀 유니폼은 피하세요.</li>
          <li>술은 만 18세부터 살 수 있고, 신분증(여권)을 보여 달라고 할 수 있어요.</li>
          <li>주문과 계산은 바에서 직접 해요. 테이블 서빙이 없는 곳이 많아요.</li>
          <li>토요일 오후 3시 경기는 영국에서 TV 중계를 하지 않아요 (블랙아웃). 이 경기는 펍에서도 못 봐요.</li>
          <li>중계 여부와 영업시간은 바뀔 수 있어요. 가기 전에 홈페이지나 지도로 확인하세요.</li>
        </ul>
      </section>

      <p className="mt-6 text-[11px] text-gray-400">
        펍 위치·영업시간: ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a>{' '}
        기여자 (ODbL). 팬 펍·한 줄 팁은 factos 회원 제보예요.
      </p>
    </div>
  );
}
