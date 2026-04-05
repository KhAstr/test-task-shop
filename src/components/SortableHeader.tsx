import { type JSX } from "react";
import type { SortField, SortOrder } from "../hooks/useSorting";

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSortField: SortField;
  currentSortOrder: SortOrder;
  onSort: (field: SortField) => void;
  className?: string;
}

const SortableHeader = ({
  label,
  field,
  currentSortField,
  currentSortOrder,
  onSort,
  className = ""
}: SortableHeaderProps): JSX.Element => {
  const isActive = currentSortField === field;
  
  return (
    <div 
      className={`sortable-header ${className} ${isActive ? 'active' : ''}`}
      onClick={() => onSort(field)}
    >
      <span className="sortable-header__label">{label}</span>
      <span className="sortable-header__icons">
        <span className={`sort-icon asc ${isActive && currentSortOrder === 'asc' ? 'active' : ''}`}>▲</span>
        <span className={`sort-icon desc ${isActive && currentSortOrder === 'desc' ? 'active' : ''}`}>▼</span>
      </span>
    </div>
  );
};

export default SortableHeader;