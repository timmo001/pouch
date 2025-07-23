import { createLoader, parseAsString } from "nuqs/server";

export const createSearchParams = {
  title: parseAsString,
  text: parseAsString,
  url: parseAsString,
};

export const loadSearchParams = createLoader(createSearchParams);
