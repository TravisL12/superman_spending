import { isEmpty } from "lodash";

export function qsToArray(value) {
  return Array.isArray(value) ? [...value] : !isEmpty(value) ? [value] : [];
}

export function filterOutValue(value, keyword) {
  if (typeof value === "string" && value === keyword) {
    return "";
  }

  return value.filter(search => search !== keyword);
}
