import { useState, useEffect, useRef } from "react";
import "./Search.css";

interface SearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

const Search = ({ onSearch, isLoading = false, initialValue = "" }: SearchProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, onSearch]);

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <span className="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Найти"
          className="search-input"
          disabled={isLoading}
        />
        {inputValue && (
          <button onClick={handleClear} className="search-clear" disabled={isLoading}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;