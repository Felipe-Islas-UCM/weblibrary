interface TypeSelectorProps {
    types: string[];
    selectedType: string;
    onTypeChange: (type: string) => void;
    onSearch: () => void;
  }
  
  const TypeSelector = ({ types, selectedType, onTypeChange, onSearch }: TypeSelectorProps) => {
    return (
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="type-select" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Libro
          </label>
          <select
            id="type-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          >
            <option value="">Todos los tipos</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onSearch}
          className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
        >
          Buscar
        </button>
      </div>
    );
  };
  
  export default TypeSelector;