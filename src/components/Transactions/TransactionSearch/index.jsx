import React from "react";
import CategoryDropdown from "components/CategoryDropdown";
import style from "components/Transactions/TransactionsInputs.module.scss";

function TransactionSearch({
  transactions,
  searchInput,
  dateInput,
  updateSearch,
  submitSearch,
  resetSearch
}) {
  return (
    <div className={style.searchContainer}>
      <div>{transactions.length} Rows</div>
      <form className={style.search} onSubmit={submitSearch}>
        <div className={style.input}>
          <label>Keyword</label>
          <input
            type="text"
            name="keyword"
            placeholder="Keyword"
            value={searchInput.keyword}
            onChange={updateSearch}
          />
        </div>
        <div className={style.input}>
          <label>After Date</label>
          <input
            type="text"
            name="afterDate"
            placeholder="YYYY-MM-DD"
            value={searchInput.afterDate}
            onChange={updateSearch}
          />
        </div>
        <div className={style.input}>
          <label>Before Date</label>
          <input
            type="text"
            name="beforeDate"
            placeholder="YYYY-MM-DD"
            value={searchInput.beforeDate}
            onChange={updateSearch}
          />
        </div>
        <div className={style.input}>
          <CategoryDropdown
            onChange={updateSearch}
            selectedCategories={searchInput.categoryIds}
          />
        </div>
        <div className={style.input}>
          <button onClick={resetSearch}>Reset</button>
          <input type="submit" value={"Search"} />
        </div>
      </form>
    </div>
  );
}

export default TransactionSearch;
