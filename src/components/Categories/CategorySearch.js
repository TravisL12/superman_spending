import React, { useState } from "react";
import style from "./Categories.module.scss";
import AuthService from "middleware/AuthService";
import qs from "query-string";

function CategorySearch({ getSearchResults, history }) {
  const [searchInput, setSearchInput] = useState("");

  const fetch = search => {
    if (!search) return;

    const query = qs.stringify({ keywordSearches: search });

    AuthService.fetch(`api/transactions/list/0?${query}`).then(
      ({ searchResults, transactions }) => {
        const { transactionTotals, name } = searchResults[0];
        getSearchResults(
          {
            [name]: { id: name, name, transactionTotals }
          },
          transactions
        );
        setSearchInput("");
        history.push({
          search: qs.stringify({ keywordSearches: search })
        });
      }
    );
  };

  return (
    <div className={style.searchInput}>
      <form
        onSubmit={e => {
          e.preventDefault();
          fetch(searchInput);
        }}
      >
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
