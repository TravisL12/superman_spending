import React from "react";
import Loading from "components/Loading";
import { CategoriesConsumer } from "providers/CategoriesProvider";
import { sortBy } from "lodash";

function CategoryDropdown({ onChange, selectedCategory, transactionId }) {
  const updateSelection = ({ target: { value } }) => {
    onChange({ target: { value, transactionId } });
  };

  const id = selectedCategory ? selectedCategory.id : 0;

  return (
    <CategoriesConsumer>
      {({ categories }) => {
        if (!categories) {
          return <Loading />;
        }

        return (
          <select name={"categoryIds"} value={id} onChange={updateSelection}>
            {sortBy(categories, "name").map((cat, idx) => (
              <option key={idx} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        );
      }}
    </CategoriesConsumer>
  );
}

export default CategoryDropdown;
