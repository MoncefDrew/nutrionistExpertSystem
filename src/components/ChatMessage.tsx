export function ChatMessage({ message, isUser }: { message: string; isUser?: boolean }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0 flex items-center justify-center">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
      )}
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${isUser 
          ? 'bg-[#333] text-white rounded-br-none' 
          : 'bg-[#222] text-gray-100 rounded-bl-none border border-[#333]'
        }`}
      >
        {message.split('\n').map((paragraph, i) => (
          <p key={i} className="mb-2 last:mb-0">
            {paragraph || <br />}
          </p>
        ))}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#222] flex-shrink-0 flex items-center justify-center border border-[#333]">
          <span className="text-white text-sm font-bold">U</span>
        </div>
      )}
    </div>
  );
}