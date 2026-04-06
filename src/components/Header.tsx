import { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Search from "./Search";
import { useSetSearchQuery, useSearchQuery } from "../stores/filtersStore"; 
import { useAuthStore } from "../stores/authStore";
import "./Header.css";

const Header = () => {
  const setSearchQuery = useSetSearchQuery();
  const searchQuery = useSearchQuery(); 
  const { logout } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const queryFromURL = searchParams.get("search") || "";
    if (queryFromURL && queryFromURL !== searchQuery) {
      setSearchQuery(queryFromURL);
    }
  }, []); 

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    setSearchParams(
      (prev) => {
        if (query) {
          prev.set("search", query);
        } else {
          prev.delete("search");
        }
        return prev;
      },
      { replace: true }
    );
  }, [setSearchQuery, setSearchParams]);

  return (
    <header className="header">
      <div className="header__container">

        <div className="header__title">
            <h2>Товары</h2>
        </div>

        <div className="header__search">
          <Search 
            onSearch={handleSearch} 
            initialValue={searchQuery}
            isLoading={false}
          />
        </div>

        <div className="header__actions">
          <button 
            className="header__btn-logout" 
            onClick={logout}
            title="Выйти"
          >Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;