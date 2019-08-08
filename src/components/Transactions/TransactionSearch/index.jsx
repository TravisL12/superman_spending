import React from "react";
import CategorySelect from "components/CategoryInputs/select";
import style from "components/Transactions/TransactionsInputs.module.scss";

function TransactionSearch({
  transactions,
  searchInput,
  dateInput,
  onSearchChange,
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
            onChange={onSearchChange}
          />
        </div>
        <div className={style.input}>
          <label>After Date</label>
          <input
            type="text"
            name="afterDate"
            placeholder="YYYY-MM-DD"
            value={searchInput.afterDate}
            onChange={onSearchChange}
          />
        </div>
        <div className={style.input}>
          <label>Before Date</label>
          <input
            type="text"
            name="beforeDate"
            placeholder="YYYY-MM-DD"
            value={searchInput.beforeDate}
            onChange={onSearchChange}
          />
        </div>
        <div className={style.input}>
          <CategorySelect
            onChange={onSearchChange}
            selectedCategories={searchInput.categoryIds}
          />
        </div>
        <div className={style.input}>
          <input type="button" onClick={resetSearch} value={"Reset"} />
          <input type="submit" value={"Search"} />
        </div>
      </form>
    </div>
  );
}

export default TransactionSearch;
