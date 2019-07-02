import React, { useState, useEffect } from "react";
import AuthService from "middleware/AuthService";

function CategoryDropdown() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categories.length === 0) {
      AuthService.fetch("api/categories").then(({ categories }) => {
        console.log(categories);
        setCategories(categories);
      });
    }
  }, []);

  return (
    categories.length > 0 && (
      <select value={"Categories"}>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
    )
  );
}

export default CategoryDropdown;
