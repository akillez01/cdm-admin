import { ChevronDown, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
}

interface AutocompleteProps {
  id?: string;
  name?: string;
  placeholder?: string;
  options: AutocompleteOption[];
  value?: string;
  onChange: (value: string, option?: AutocompleteOption) => void;
  onInputChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  noOptionsText?: string;
  clearable?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  id,
  name,
  placeholder = 'Digite para buscar...',
  options = [],
  value = '',
  onChange,
  onInputChange,
  className = '',
  disabled = false,
  required = false,
  loading = false,
  noOptionsText = 'Nenhuma opção encontrada',
  clearable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter options based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [inputValue, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = useCallback((option: AutocompleteOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onChange(option.value, option);
    inputRef.current?.blur();
  }, [onChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, highlightedIndex, handleSelectOption]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onInputChange?.(newValue);
    
    // If the input doesn't match any option exactly, clear the selection
    const exactMatch = options.find(option => option.label === newValue);
    if (!exactMatch) {
      onChange('');
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    onInputChange?.('');
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const showClearButton = clearable && inputValue && !disabled;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-md border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 py-2 px-3 pr-10 text-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          autoComplete="off"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
          )}
          
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-1"
            >
              <X size={14} />
            </button>
          )}
          
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <ul ref={listRef} className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`
                    px-3 py-2 text-sm cursor-pointer transition-colors
                    ${index === highlightedIndex 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Carregando...' : noOptionsText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
