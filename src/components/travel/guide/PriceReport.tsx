'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/member';
import { ITEM_CATEGORIES, submitReport, type ItemCategory, type StadiumItem } from '@/lib/travel';
import { inputClass, parsePounds, today } from './ItemForm';

/**
 * 회원 가격 제보. [item]이 있으면 그 항목의 지금 가격, 없으면 새 항목.
 * 관리자가 승인해야 반영된다
 */
export default function PriceReport({ item, clubId }: { item?: StadiumItem; clubId?: string }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ItemCategory>('FOOD');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [seenOn, setSeenOn] = useState(today());
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    const pricePence = parsePounds(price);
    if (pricePence === undefined || (item && pricePence === null)) {
      setError('본 가격을 파운드로 적어 주세요 (예: 4.80).');
      return;
    }
    setSending(true);
    setError('');
    try {
      await submitReport(
        item
          ? { kind: 'ITEM', itemId: item.id, pricePence: pricePence as number, note: note || undefined, seenOn }
          : { kind: 'ITEM', club: clubId as string, category, name, pricePence, note: note || undefined, seenOn },
      );
      setMsg('고마워요! 관리자가 확인하고 반영할게요.');
      setOpen(false);
      setPrice('');
      setName('');
      setNote('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '보내지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <span className={item ? '' : 'flex flex-col gap-1'}>
        <button type="button" onClick={() => { setOpen(true); setMsg(''); }}
          className={item ? 'text-[11px] font-bold text-gray-400 hover:text-gray-600' : 'text-sm font-bold text-left'}
          style={item ? undefined : { color: 'var(--primary)' }}>
          {item ? '가격 제보' : '+ 내가 본 가격 알려 주기'}
        </button>
        {msg && <span className="text-xs text-green-600">{msg}</span>}
      </span>
    );
  }

  return (
    <div className={`${item ? 'mt-2 w-60 text-left' : ''} p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] flex flex-col gap-2`}>
      {item ? (
        <p className="text-xs text-gray-500">{item.nameKo || item.name} — 지금 얼마였나요?</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value as ItemCategory)} className={inputClass}>
            {ITEM_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 (메뉴판 그대로)" maxLength={100} className={inputClass} />
        </div>
      )}
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="가격 £ (예: 4.80)" inputMode="decimal" className={inputClass} />
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="한 줄 팁 (선택)" maxLength={300} className={inputClass} />
      <label className="flex items-center gap-2 text-xs text-gray-500">
        본 날 <input type="date" value={seenOn} onChange={(e) => setSeenOn(e.target.value)} className={`${inputClass} w-auto`} />
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="px-3 h-8 rounded-lg text-xs font-bold text-gray-500">취소</button>
        <button type="button" onClick={send} disabled={sending || (!item && !name.trim())}
          className="px-3 h-8 rounded-lg text-xs font-bold text-white disabled:opacity-40" style={{ backgroundColor: 'var(--primary)' }}>
          보내기
        </button>
      </div>
    </div>
  );
}
