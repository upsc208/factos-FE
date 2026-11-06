'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchMe, fetchProviders, loginUrl, logout as apiLogout, type Member, type Provider } from '@/lib/member';

interface MemberState {
  member: Member | null;
  loading: boolean; // 처음 /me 응답 전. 이때는 로그인 버튼도 내 정보도 그리지 않는다 (깜빡임 방지)
  providers: Provider[];
  login: (provider: Provider) => void;
  logout: () => Promise<void>;
  setMember: (member: Member | null) => void; // 가입 마치기·정보 수정·탈퇴 뒤 화면 갱신용
}

const MemberContext = createContext<MemberState | null>(null);

const SIGNUP_PATH = '/signup';

/** 로그인 상태를 앱 전체에 한 번만 읽어 둔다 (헤더·댓글·즐겨찾기가 같이 쓴다) */
export default function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 백엔드가 꺼져 있어도 페이지는 떠야 한다 — 실패하면 비로그인으로 둔다
    fetchMe().then(setMember).catch(() => setMember(null)).finally(() => setLoading(false));
    fetchProviders().then(setProviders).catch(() => setProviders([]));
  }, []);

  // 로그인은 했는데 가입을 안 마쳤으면(닉네임·응원팀 미정) 어느 페이지에 있든 가입 마치기로 보낸다
  useEffect(() => {
    if (member && !member.signupCompleted && pathname !== SIGNUP_PATH) {
      router.replace(`${SIGNUP_PATH}?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [member, pathname, router]);

  const login = useCallback((provider: Provider) => {
    window.location.href = loginUrl(provider, window.location.pathname + window.location.search);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout().catch(() => undefined);
    setMember(null);
  }, []);

  return (
    <MemberContext.Provider value={{ member, loading, providers, login, logout, setMember }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember(): MemberState {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember는 MemberProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
