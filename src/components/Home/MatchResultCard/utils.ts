/**
 * Formats a date string to KST (Asia/Seoul)
 */
export const formatKST = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(d);
  } catch {
    return dateStr;
  }
};

/**
 * Sorts scorers by time (earliest first)
 */
export const sortScorers = (scorers: any[] | null | undefined = []) => {
  const safeScorers = scorers || [];
  return [...safeScorers].sort((a, b) => {
    const timeA = parseInt(a.time.replace(/[^0-9]/g, '')) || 0;
    const timeB = parseInt(b.time.replace(/[^0-9]/g, '')) || 0;
    return timeA - timeB;
  });
};

/**
 * Stats translation map
 */
export const STATS_TRANSLATIONS: Record<string, string> = {
  'Possession': '점유율',
  'Shots': '슈팅',
  'Shots on Target': '유효 슈팅',
  'Corners': '코너킥',
  'Offsides': '오프사이드',
  'Fouls': '파울',
  'Yellow Cards': '경고',
  'Red Cards': '퇴장',
  'Saves': '선방',
  'Expected Goals': 'Expected Goals (xG)',
  'Pass Accuracy': '패스 성공률',
  'Big Chances': '결정적 찬스',
  'Total Passes': '전체 패스',
  'Tackles': '태클',
  'Interceptions': '인터셉트',
  'Clearances': '클리어링',
  'Distance Covered': '활동량'
};

/**
 * Custom display order for match statistics
 */
export const STATS_DISPLAY_ORDER = [
  'Possession', 'Expected Goals', 'Pass Accuracy', 'Shots', 'Shots on Target', 
  'Saves', 'Corners', 'Fouls', 'Yellow Cards', 'Red Cards'
];
