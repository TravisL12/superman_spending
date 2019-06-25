import React from "react";
import style from "components/Transactions/TransactionImporter/TransactionsInputs.module.scss";

function TransactionSearch(props) {
  const {
    transactions,
    searchQuery,
    updateSearch,
    searches,
    submitSearch,
    removeSearch
  } = props;

  return (
    <div className={style.searchContainer}>
      <div>{transactions.length} Rows</div>
      <div className={style.search}>
        <input type="text" value={searchQuery} onChange={updateSearch} />
        <button onClick={submitSearch}>Search</button>
      </div>
      <ul>
        {searches.map((search, idx) => {
          return (
            <li key={idx}>
              {search} <button onClick={() => removeSearch(search)}>X</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TransactionSearch;
