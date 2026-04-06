import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SortField, SortOrder } from '../types/sorting';

interface FiltersState {
  searchQuery: string;
  page: number;
  sortField: SortField;
  sortOrder: SortOrder;
  limit: number;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setSorting: (field: SortField, order: SortOrder) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      searchQuery: '',
      page: 1,
      sortField: 'title',
      sortOrder: 'asc',
      limit: 5,
      setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
      setPage: (page) => set({ page }),
      setSorting: (field, order) => set({ sortField: field, sortOrder: order, page: 1 }),
      resetFilters: () => set({
        searchQuery: '',
        page: 1,
        sortField: 'title',
        sortOrder: 'asc',
      }),
    }),
    {
      name: 'filters-storage',
    }
  )
);

export const useSearchQuery = () => useFiltersStore((state) => state.searchQuery);
export const usePage = () => useFiltersStore((state) => state.page);
export const useSortField = () => useFiltersStore((state) => state.sortField);
export const useSortOrder = () => useFiltersStore((state) => state.sortOrder);
export const useLimit = () => useFiltersStore((state) => state.limit);
export const useSetPage = () => useFiltersStore((state) => state.setPage);
export const useSetSearchQuery = () => useFiltersStore((state) => state.setSearchQuery);
export const useSetSorting = () => useFiltersStore((state) => state.setSorting);