import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchableMultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  isLoading?: boolean;
}

export default function SearchableMultiSelect({
  options,
  value,
  onChange,
  placeholder,
  isLoading = false
}: SearchableMultiSelectProps) {
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option => 
        option.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, options]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>
      
      {isLoading ? (
        <div className="text-zinc-400 text-sm">Loading...</div>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md cursor-pointer"
              onClick={() => {
                if (value.includes(option)) {
                  onChange(value.filter(v => v !== option));
                } else {
                  onChange([...value, option]);
                }
              }}
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                readOnly
                className="rounded border-zinc-600"
              />
              <span className="text-white">{option}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((item) => (
          <span
            key={item}
            className="bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {item}
            <button
              onClick={() => onChange(value.filter(v => v !== item))}
              className="hover:text-emerald-400"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
} 