import "./Search.css";

function Search({ searchQuery, setSearchQuery }) {
  return (
    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form_input">
        <label htmlFor="search">Search</label>
        <input
          value={searchQuery}
          id="search"
          type="text"
          name="search"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </form>
  );
}

export default Search;
