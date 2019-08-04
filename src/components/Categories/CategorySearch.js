import React, { useState } from "react";
import style from "./Categories.module.scss";
import AuthService from "middleware/AuthService";
import qs from "query-string";

function CategorySearch() {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState({});

  const fetch = e => {
    e.preventDefault();
    if (!searchInput) return;

    const query = qs.stringify({ keywordSearches: searchInput });

    AuthService.fetch(`api/transactions/list/0?${query}`).then(
      ({ transactions, searchResults }) => {
        setResults(searchResults);
      }
    );
  };

  return (
    <div className={style.searchInput}>
      <form onSubmit={fetch}>
        <input
          type="text"
          placeholder="Search for Stuff"
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
        />
      </form>
    </div>
  );
}

export default CategorySearch;
