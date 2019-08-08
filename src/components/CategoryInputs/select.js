import React from "react";
import Loading from "components/Loading";
import { CategoriesConsumer } from "providers/CategoriesProvider";
import { sortBy } from "lodash";
import style from "./CategoryInputs.module.scss";

function CategorySelect({ onChange, selectedCategories }) {
  // Group all selected categories
  const updateSelection = ({ target: { value } }) => {
    onChange({
      target: { value: [...selectedCategories, value], name: "categoryIds" }
    });
  };

  return (
    <CategoriesConsumer>
      {({ categories, fetchCategories }) => {
        if (!categories) {
          fetchCategories();
          return <Loading />;
        }

        return (
          <div className={style.dropdown}>
            {sortBy(categories, "name").map(cat => (
              <div key={`category-${cat.id}`}>
                <input
                  id={cat.id}
                  type="checkbox"
                  value={cat.id}
                  checked={selectedCategories.includes(String(cat.id))}
                  onChange={updateSelection}
                />
                <label htmlFor={cat.id}>{cat.name}</label>
              </div>
            ))}
          </div>
        );
      }}
    </CategoriesConsumer>
  );
}

export default CategorySelect;
