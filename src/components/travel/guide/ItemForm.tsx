'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/member';
import { createItem, ITEM_CATEGORIES, updateItem, type ItemCategory, type StadiumItem } from '@/lib/travel';

export const inputClass =
  'w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b0d11] text-sm text-gray-800 dark:text-gray-100';

/** 파운드 입력 "4.8" → 480펜스. 비우면 null, 잘못된 값이면 undefined */
export function parsePounds(raw: string): number | null | undefined {
  const t = raw.trim().replace(/^£/, '');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 1000 ? Math.round(n * 100) : undefined;
}

export const today = () => new Date().toISOString().slice(0, 10);

/** 관리자: 경기장 항목 추가·고치기 */
export default function ItemForm({ clubId, item, onDone, onCancel }: {
  clubId: string; item?: StadiumItem; onDone: () => void; onCancel: () => void;
}) {
  const [category, setCategory] = useState<ItemCategory>(item?.category ?? 'FOOD');
  const [name, setName] = useState(item?.name ?? '');
  const [nameKo, setNameKo] = useState(item?.nameKo ?? '');
  const [price, setPrice] = useState(item?.pricePence != null ? (item.pricePence / 100).toFixed(2) : '');
  const [note, setNote] = useState(item?.note ?? '');
  const [checkedOn, setCheckedOn] = useState(item?.checkedOn ?? today());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const pricePence = parsePounds(price);
    if (pricePence === undefined) {
      setError('가격은 파운드 숫자로 적어 주세요 (예: 4.80).');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = { category, name, nameKo: nameKo || null, pricePence, note: note || null, checkedOn: checkedOn || null };
      await (item ? updateItem(item.id, body) : createItem(clubId, body));
      onDone();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '저장하지 못했어요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-5 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] grid grid-cols-2 gap-2">
      <select value={category} onChange={(e) => setCategory(e.target.value as ItemCategory)} className={inputClass}>
        {ITEM_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="가격 £ (예: 4.80)" inputMode="decimal" className={inputClass} />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="현지 이름 (Chicken Balti Pie)" maxLength={100} className={inputClass} />
      <input value={nameKo} onChange={(e) => setNameKo(e.target.value)} placeholder="한국어 이름" maxLength={100} className={inputClass} />
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="팁 (카드만 받아요 …)" maxLength={300} className={`${inputClass} col-span-2`} />
      <label className="col-span-2 flex items-center gap-2 text-xs text-gray-500">
        확인한 날 <input type="date" value={checkedOn} onChange={(e) => setCheckedOn(e.target.value)} className={`${inputClass} w-auto`} />
      </label>
      {error && <p className="col-span-2 text-xs text-red-500">{error}</p>}
      <div className="col-span-2 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 h-9 rounded-xl text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-500">취소</button>
        <button type="button" onClick={save} disabled={saving || !name.trim()}
          className="px-4 h-9 rounded-xl text-xs font-bold text-white disabled:opacity-40" style={{ backgroundColor: 'var(--primary)' }}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>
    </div>
  );
}
