import { useState, useEffect } from "react";
import AuthService from "middleware/AuthService";

function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AuthService.fetch("api/categories").then(({ categories }) => {
      setCategories(categories);
    });
  }, []);

  return {
    categories
  };
}

export default useCategories;
