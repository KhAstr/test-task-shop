// hooks/useSorting.ts
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortField = 'title' | 'price' | 'rating' | 'brand' | 'category' | 'sku';
export type SortOrder = 'asc' | 'desc';

export const useSorting = (defaultField: SortField = 'title', defaultOrder: SortOrder = 'asc') => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentField = (searchParams.get('sortBy') as SortField) || defaultField;
  const currentOrder = (searchParams.get('sortOrder') as SortOrder) || defaultOrder;

  const toggleSort = useCallback((field: SortField) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        const currentFieldFromURL = newParams.get('sortBy');
        const currentOrderFromURL = newParams.get('sortOrder') as SortOrder;
        
        const newOrder: SortOrder = 
          currentFieldFromURL === field && currentOrderFromURL === 'asc' ? 'desc' : 'asc';
        
        newParams.set('sortBy', field);
        newParams.set('sortOrder', newOrder);
        return newParams;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  return { 
    sorting: { field: currentField, order: currentOrder }, 
    toggleSort 
  };
};