import React from "react";
import style from "components/Transactions/TransactionsInputs.module.scss";

function TransactionSearch({
  transactions,
  searchInput,
  dateInput,
  updateSearch,
  submitSearch
}) {
  return (
    <div className={style.searchContainer}>
      <div>{transactions.length} Rows</div>
      <form className={style.search} onSubmit={submitSearch}>
        <input
          type="text"
          name="keyword"
          placeholder="Keyword"
          value={searchInput.keyword}
          onChange={updateSearch}
        />
        <input
          type="text"
          name="afterDate"
          placeholder="After Date"
          value={searchInput.afterDate}
          onChange={updateSearch}
        />
        <input
          type="text"
          name="beforeDate"
          placeholder="Before Date"
          value={searchInput.beforeDate}
          onChange={updateSearch}
        />
        <input type="submit" value={"Search"} />
      </form>
    </div>
  );
}

export default TransactionSearch;
