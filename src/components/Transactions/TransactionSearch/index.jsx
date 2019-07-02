import React from "react";
import style from "components/Transactions/TransactionsInputs.module.scss";

function TransactionSearch({
  transactions,
  keywordInput,
  updateSearch,
  submitSearch
}) {
  return (
    <div className={style.searchContainer}>
      <div>{transactions.length} Rows</div>
      <form className={style.search} onSubmit={submitSearch}>
        <input
          type="text"
          name="keywordInput"
          value={keywordInput}
          onChange={updateSearch}
        />
        <input type="submit" value={"Search"} />
      </form>
    </div>
  );
}

export default TransactionSearch;
