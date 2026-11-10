'use client';

import { useState } from 'react';
import { Clock, ExternalLink, MapPin, Tv } from 'lucide-react';
import { useMember } from '@/components/member/MemberProvider';
import { CLUBS } from '@/config/clubs';
import { ApiError } from '@/lib/member';
import { formatDistance, mapsUrl, submitReport, walkMinutes, type PubRow } from '@/lib/travel';
import { inputClass } from './ItemForm';

/** 펍 한 곳. 로그인 회원은 "이 팀 팬 펍이에요 / 중계해요"를 알려 줄 수 있다 (관리자 승인 뒤 반영) */
export default function PubCard({ pub, clubId }: { pub: PubRow; clubId: string }) {
  const { member } = useMember();
  const [open, setOpen] = useState(false);
  const [fan, setFan] = useState(false);
  const [football, setFootball] = useState(false);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const send = async () => {
    setError('');
    try {
      await submitReport({
        kind: 'PUB', pubId: pub.id,
        club: fan ? clubId : null,
        showsFootball: football ? true : null,
        note: note.trim() || undefined,
      });
      setMsg('고마워요! 관리자가 확인하고 반영할게요.');
      setOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '보내지 못했어요.');
    }
  };

  const fanClub = pub.club ? CLUBS[pub.club] : null;

  return (
    <li className="py-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-white break-words">
            {pub.name}
            <span className="ml-1.5 text-[11px] font-normal text-gray-400">{pub.kind === 'BAR' ? '바' : '펍'}</span>
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {fanClub && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: 'var(--primary)' }}>
                {fanClub.nameKo} 팬 펍
              </span>
            )}
            {pub.showsFootball && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                <Tv size={11} /> 스포츠 중계
              </span>
            )}
          </div>
          {pub.note && <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300">{pub.note}</p>}
          {pub.address && <p className="mt-1 text-xs text-gray-500">{pub.address}</p>}
          {pub.openingHours && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400"><Clock size={11} /> {pub.openingHours}</p>
          )}
        </div>
        {pub.distanceMeters != null && (
          <div className="text-right shrink-0">
            <p className="text-sm font-black text-gray-900 dark:text-white">{formatDistance(pub.distanceMeters)}</p>
            <p className="text-[11px] text-gray-400">걸어서 {walkMinutes(pub.distanceMeters)}분</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
        <a href={mapsUrl(pub)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700">
          <MapPin size={12} /> 지도
        </a>
        {pub.website && (
          <a href={pub.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <ExternalLink size={12} /> 홈페이지
          </a>
        )}
        {member && !open && (
          <button type="button" onClick={() => { setOpen(true); setMsg(''); }} className="text-gray-400 hover:text-gray-600">정보 알려 주기</button>
        )}
        {msg && <span className="font-normal text-green-600">{msg}</span>}
      </div>

      {open && (
        <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={fan} onChange={(e) => setFan(e.target.checked)} /> {CLUBS[clubId]?.nameKo} 팬이 모이는 곳이에요</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={football} onChange={(e) => setFootball(e.target.checked)} /> 축구 중계를 틀어 줘요</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="한 줄 팁 (경기일 홈 팬 전용, 2시간 전엔 꽉 차요 …)" maxLength={300} className={inputClass} />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 h-8 rounded-lg text-xs font-bold text-gray-500">취소</button>
            <button type="button" onClick={send} disabled={!fan && !football && !note.trim()}
              className="px-3 h-8 rounded-lg text-xs font-bold text-white disabled:opacity-40" style={{ backgroundColor: 'var(--primary)' }}>
              보내기
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
