import { useSearch } from "../store/SearchContext";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="app-header">
      <div className="header-search-wrapper">
        <FiSearch className="header-search-icon" aria-hidden="true" />
        <input
          id="global-search"
          type="search"
          className="header-search-input"
          placeholder="Search posts..."
          aria-label="Search posts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn-header-login"
          aria-label="Log in to your account"
        >
          Log in
        </button>
        <button
          type="button"
          className="btn-header-signup"
          aria-label="Sign up for a new account"
        >
          Sign up
        </button>
      </div>
    </header>
  );
};

export default Header;