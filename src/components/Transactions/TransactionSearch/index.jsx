import React from "react";
import style from "components/Transactions/TransactionsInputs.module.scss";

function TransactionSearch({
  transactions,
  searchQuery,
  updateSearch,
  submitSearch
}) {
  return (
    <div className={style.searchContainer}>
      <div>{transactions.length} Rows</div>
      <form className={style.search} onSubmit={submitSearch}>
        <input
          type="text"
          name="searchQuery"
          value={searchQuery}
          onChange={updateSearch}
        />
        <input type="submit" value={"Search"} />
      </form>
    </div>
  );
}

export default TransactionSearch;
