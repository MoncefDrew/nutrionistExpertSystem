'use client';
import { AuthHeader } from '../../../components/auth-header';
import { Chat } from '../../../components/Chat';

export default function ChatScreen() {
  return (
    <div className="h-screen bg-[#171717] flex flex-col">
      <AuthHeader  />
      <div className="flex-1 flex justify-center items-start px-4 overflow-hidden">
        <div className="flex flex-col w-full max-w-3xl h-full bg-[#2a2a2a] shadow-2xl border border-gray-500">
          <Chat />
        </div>
      </div>
    </div>
  );
}