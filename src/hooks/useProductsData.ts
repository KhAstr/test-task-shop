import { useFiltersStore } from "../stores/filtersStore";
import useProducts from "./useProducts";
import { useProductSearch } from "./useProductSearch";

const useProductsData = () => {
  const { searchQuery, page, limit, sortField, sortOrder } = useFiltersStore();
  const skip = (page - 1) * limit;
  const isSearching = searchQuery.trim().length > 0;

  const searchResult = useProductSearch({
    searchQuery,
    page,
    limit,
    sortField,
    sortOrder,
  });

  const productsResult = useProducts({
    limit,
    skip,
    sortField,
    sortOrder,
  });

  return isSearching ? searchResult : productsResult;
};

export default useProductsData;