import React from "react";
import { CategoriesConsumer } from "providers/CategoriesProvider";
import { sortBy } from "lodash";

function CategoryDropdown({ onChange, selectedCategories }) {
  // Group all selected categories
  const updateSelection = ({ target: { value, name } }) => {
    onChange({ target: { value: [...selectedCategories, value], name } });
  };

  return (
    <CategoriesConsumer>
      {categories => {
        return (
          <select
            name={"categoryIds"}
            multiple
            value={selectedCategories}
            onChange={updateSelection}
          >
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
