'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CalendarDays, MapPin, Pencil, Plus, Train, Trash2, Tv } from 'lucide-react';
import { useMember } from '@/components/member/MemberProvider';
import { ApiError } from '@/lib/member';
import {
  deleteItem, fetchItems, fetchStadiumGuide, fetchTravelFixtures, formatGbp, formatKrw, isStale, isUkBlackout,
  ITEM_CATEGORIES, kstTime, mapsUrl, ukTime,
  type ItemsResponse, type StadiumGuide, type StadiumItem, type TravelFixture,
} from '@/lib/travel';
import ItemForm from './ItemForm';
import PriceReport from './PriceReport';

const card = 'rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111318] p-5';

/** 경기장 가이드: 가는 길 · 다가올 홈경기 (한국·현지 시각) · 경기장 안 굿즈·음식 가격 */
export default function StadiumGuideView({ clubId }: { clubId: string }) {
  const { member } = useMember();
  const [guide, setGuide] = useState<StadiumGuide | null>(null);
  const [fixtures, setFixtures] = useState<TravelFixture[]>([]);
  const [items, setItems] = useState<ItemsResponse | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<StadiumItem | 'new' | null>(null);

  const loadItems = useCallback(() => {
    fetchItems(clubId).then(setItems).catch(() => setItems(null));
  }, [clubId]);

  useEffect(() => {
    fetchStadiumGuide(clubId, 800).then(setGuide).catch((e) => setError(e instanceof ApiError ? e.message : '경기장 정보를 불러오지 못했어요.'));
    fetchTravelFixtures(clubId).then((list) => setFixtures(list.filter((f) => f.isHome).slice(0, 5))).catch(() => setFixtures([]));
  }, [clubId]);

  // 관리자 여부(canManage)가 로그인에 따라 달라진다
  useEffect(() => { loadItems(); }, [loadItems, member?.id]);

  const remove = async (id: number) => {
    if (!window.confirm('이 항목을 지울까요?')) return;
    try {
      await deleteItem(id);
      loadItems();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '지우지 못했어요.');
    }
  };

  if (error && !guide) return <p className="py-20 text-center text-red-500">{error}</p>;
  if (!guide) return null;
  const { stadium } = guide;

  return (
    <div className="flex flex-col gap-6">
      <section className={card}>
        <p className="text-xs font-bold text-gray-400">{stadium.city}</p>
        <h2 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{stadium.nameKo}</h2>
        <p className="text-sm text-gray-500">{stadium.name}</p>
        {stadium.transit && (
          <p className="mt-4 flex gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Train size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} /> {stadium.transit}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={mapsUrl(stadium)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 h-9 rounded-xl text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
            <MapPin size={14} /> 지도에서 보기
          </a>
          <Link href={`/${clubId}/travel/pubs`}
            className="inline-flex items-center gap-1 px-3 h-9 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>
            근처 펍 {guide.pubs.length > 0 && `${guide.pubs.length}곳`}
          </Link>
        </div>
      </section>

      {fixtures.length > 0 && (
        <section className={card}>
          <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
            <CalendarDays size={18} style={{ color: 'var(--primary)' }} /> 다가올 홈경기
          </h3>
          <ul className="flex flex-col gap-3">
            {fixtures.map((f) => (
              <li key={f.matchId} className="text-sm">
                <p className="font-bold text-gray-900 dark:text-white">vs {f.opponent} <span className="ml-1 text-xs font-normal text-gray-400">{f.tournament}</span></p>
                <p className="text-gray-500 dark:text-gray-400">현지 {ukTime(f.kickoff)} · 한국 {kstTime(f.kickoff)}</p>
                {isUkBlackout(f.kickoff) && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                    <Tv size={12} /> 토요일 3시 경기라 영국 TV·펍 중계가 없어요 (블랙아웃)
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={card}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900 dark:text-white">경기장 안 굿즈·음식</h3>
          {items?.canManage && editing === null && (
            <button type="button" onClick={() => setEditing('new')} className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--primary)' }}>
              <Plus size={14} /> 항목 추가
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-5">
          가격은 시즌마다 바뀌어요. 확인한 날짜를 꼭 보세요.
          {items?.gbpKrw ? ` 원화는 1파운드 ${items.gbpKrw.toLocaleString('ko-KR')}원 기준이에요.` : ''}
        </p>

        {editing === 'new' && (
          <ItemForm clubId={clubId} onDone={() => { setEditing(null); loadItems(); }} onCancel={() => setEditing(null)} />
        )}

        {items && items.items.length === 0 && editing === null && (
          <p className="py-6 text-center text-sm text-gray-400">아직 정리된 정보가 없어요. 다녀오셨다면 아래에서 알려 주세요.</p>
        )}

        {ITEM_CATEGORIES.map((cat) => {
          const list = items?.items.filter((i) => i.category === cat.id) ?? [];
          if (list.length === 0) return null;
          return (
            <div key={cat.id} className="mb-6 last:mb-0">
              <p className="text-xs font-bold text-gray-400 mb-2">{cat.label}</p>
              <ul className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
                {list.map((i) =>
                  editing !== 'new' && editing?.id === i.id ? (
                    <li key={i.id} className="py-3">
                      <ItemForm clubId={clubId} item={i} onDone={() => { setEditing(null); loadItems(); }} onCancel={() => setEditing(null)} />
                    </li>
                  ) : (
                    <li key={i.id} className="py-3 flex gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-white">
                          {i.nameKo || i.name}
                          {i.nameKo && <span className="ml-1.5 text-xs font-normal text-gray-400">{i.name}</span>}
                        </p>
                        {i.note && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{i.note}</p>}
                        <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                          {i.checkedOn ? `${i.checkedOn.slice(0, 7).replace('-', '.')} 확인` : '확인 날짜 없음'}
                          {isStale(i.checkedOn) && <span className="inline-flex items-center gap-0.5 text-amber-600"><AlertTriangle size={11} /> 오래된 가격</span>}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-gray-900 dark:text-white">{i.pricePence != null ? formatGbp(i.pricePence) : '-'}</p>
                        {i.pricePence != null && items?.gbpKrw && <p className="text-[11px] text-gray-400">{formatKrw(i.pricePence, items.gbpKrw)}</p>}
                        <div className="mt-1 flex justify-end gap-2">
                          {member && <PriceReport item={i} />}
                          {items?.canManage && (
                            <>
                              <button type="button" title="고치기" onClick={() => setEditing(i)} className="text-gray-400 hover:text-gray-600"><Pencil size={13} /></button>
                              <button type="button" title="지우기" onClick={() => remove(i.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          );
        })}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
          {member ? (
            <PriceReport clubId={clubId} />
          ) : (
            <p className="text-xs text-gray-400">로그인하면 직접 본 가격을 알려 줄 수 있어요. 관리자가 확인하고 반영해요.</p>
          )}
        </div>
      </section>
    </div>
  );
}
