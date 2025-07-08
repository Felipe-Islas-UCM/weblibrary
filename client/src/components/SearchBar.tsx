interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  types: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder,
  types,
  selectedType,
  onTypeChange,
  onSearch,
}: SearchBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-lg border border-amber-200 
                   focus:ring-2 focus:ring-amber-200 focus:border-amber-400 
                   outline-none transition-all bg-white text-gray-800"
        />
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-4 py-3 rounded-lg border border-amber-200 
                     bg-white text-gray-800 focus:ring-2 focus:ring-amber-200 
                     focus:border-amber-400 outline-none"
        >
          <option value="">Todos los tipos</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-[#8B4513] text-white rounded-lg 
                   hover:bg-amber-800 transition-colors shadow-sm"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default SearchBar;