import React, { useState, useEffect } from "react";
import AuthService from "middleware/AuthService";

function CategoryDropdown({ onChange, selectedCategories }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AuthService.fetch("api/categories").then(({ categories }) => {
      setCategories(categories);
    });
  }, []);

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
      {categories.map((cat, idx) => (
        <option key={idx} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}

export default CategoryDropdown;
