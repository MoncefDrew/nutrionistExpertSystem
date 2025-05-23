import { Chat } from '../../../components/Chat';

export default function ChatScreen() {
  return (
    <div className=" bg-gradient-to-b from-zinc-900 to-black flex flex-col">
      <div className=" flex justify-center items-start px-4 py-6 overflow-hidden">
        <div className="flex flex-col w-full max-w-3xl h-[85vh] bg-zinc-800/50 backdrop-blur-sm shadow-2xl border border-zinc-700 rounded-xl overflow-hidden">
          <Chat />
        </div>
      </div>
    </div>
  );
}