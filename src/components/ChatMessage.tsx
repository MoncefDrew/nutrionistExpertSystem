export function ChatMessage({ message, isUser }: { message: string; isUser?: boolean }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center">
          <span className="text-white text-sm font-bold">NA</span>
        </div>
      )}
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${isUser 
          ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white rounded-br-none border border-blue-500/30' 
          : 'bg-zinc-800/50 text-zinc-100 rounded-bl-none border border-zinc-700'
        }`}
      >
        {message.split('\n').map((paragraph, i) => (
          <p key={i} className="mb-2 last:mb-0">
            {paragraph || <br />}
          </p>
        ))}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
          <span className="text-white text-sm font-bold">You</span>
        </div>
      )}
    </div>
  );
}