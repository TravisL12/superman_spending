import React from "react";
import useCategories from "hooks/useCategories";
import { sortBy } from "lodash";

function CategoryDropdown({ onChange, selectedCategories }) {
  const { categories } = useCategories();

  // Group all selected categories
  const updateSelection = ({ target: { value, name } }) => {
    onChange({ target: { value: [...selectedCategories, value], name } });
  };

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
}

export default CategoryDropdown;
