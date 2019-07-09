import React, { createContext, useState, useEffect } from "react";
import AuthService from "middleware/AuthService";

const { Provider, Consumer } = createContext();

export const CategoriesConsumer = Consumer;

function CategoriesProvider(props) {
  const [categories, setCategories] = useState(undefined);

  const fetchCategories = () => {
    if (AuthService.loggedIn()) {
      AuthService.fetch("api/categories").then(({ categories }) => {
        setCategories(categories);
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Provider value={{ categories, fetchCategories }}>
      {props.children}
    </Provider>
  );
}

export default CategoriesProvider;
