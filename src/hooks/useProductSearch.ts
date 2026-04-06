import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types/Product";
import type { SortField, SortOrder } from "../types/sorting"; 

interface SearchResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface UseProductSearchProps {
  searchQuery: string;
  page: number;
  limit?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}

export const useProductSearch = ({ 
  searchQuery, 
  page, 
  limit = 5, 
  sortField = 'title', 
  sortOrder = 'asc' 
}: UseProductSearchProps) => {
  const skip = (page - 1) * limit;

  return useQuery<SearchResponse>({
    queryKey: ["products-search", searchQuery, limit, skip, sortField, sortOrder],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return { products: [], total: 0, skip: 0, limit };
      }

      const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
        searchQuery
      )}&limit=${limit}&skip=${skip}&sortBy=${sortField}&order=${sortOrder}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }

      return response.json();
    },
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};