import { useQuery } from "@tanstack/react-query";
import fetchTimeout from "../utils/fetchTimeout";
import type { SortField, SortOrder } from "../types/sorting"; 

interface UseProductsProps {
  limit?: number;
  skip?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}

const useProducts = ({ limit = 30, skip = 0, sortField = 'title', sortOrder = 'asc' }: UseProductsProps = {}) => {
  return useQuery({
    queryKey: ['products', limit, skip, sortField, sortOrder],
    queryFn: async () => {
      const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}&sortBy=${sortField}&order=${sortOrder}`;
      const response = await fetchTimeout(url, {}, 10000);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export default useProducts;