import { CLUBS } from '@/config/clubs';
import { notFound } from 'next/navigation';
import ChatLobby from '@/components/chat/ChatLobby';

export const metadata = { title: '팬 채팅' };

/** 팀 채팅: 팀 방 + 다가올 경기 방. 실시간 연결이라 화면은 전부 클라이언트 컴포넌트가 그린다 */
export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ club: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { club: clubId } = await params;
  const club = CLUBS[clubId];
  if (!club) notFound();
  const room = (await searchParams).room;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-20 max-w-6xl">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
        {club.nameKo} 팬 채팅
      </h1>
      <ChatLobby clubId={club.id} initialRoomId={typeof room === 'string' ? room : undefined} />
    </div>
  );
}
