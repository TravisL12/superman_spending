import React, { useState } from "react";
import style from "./Categories.module.scss";
import AuthService from "middleware/AuthService";
import qs from "query-string";

function CategorySearch({ getSearchResults }) {
  const [searchInput, setSearchInput] = useState("");

  const fetch = e => {
    e.preventDefault();
    if (!searchInput) return;

    const query = qs.stringify({ keywordSearches: searchInput });

    AuthService.fetch(`api/transactions/list/0?${query}`).then(
      ({ searchResults }) => {
        const { transactionTotals, name } = searchResults[0];
        getSearchResults({ [name]: { id: name, name, transactionTotals } });
        setSearchInput("");
      }
    );
  };

  return (
    <div className={style.searchInput}>
      <form onSubmit={fetch}>
        <input
          type="text"
          placeholder="Search Spending"
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
        />
      </form>
    </div>
  );
}

export default CategorySearch;
