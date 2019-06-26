import React from "react";
import style from "components/Transactions/TransactionsInputs.module.scss";

function TransactionSearch(props) {
  const { transactions, searchQuery, updateSearch, submitSearch } = props;

  return (
    <div className={style.searchContainer}>
      <div>{transactions.length} Rows</div>
      <form className={style.search} onSubmit={submitSearch}>
        <input type="text" value={searchQuery} onChange={updateSearch} />
        <input type="submit" value={"Search"} />
      </form>
    </div>
  );
}

export default TransactionSearch;
