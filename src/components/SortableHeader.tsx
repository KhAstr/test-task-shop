import { type JSX } from "react";
import type { SortField, SortOrder } from "../types/sorting"; 
import './SortableHeader.css'

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
  console.log('🟢 SortableHeader рендер');
  const isActive = currentSortField === field;

  return (
    <div
      className={`sortable-header ${className} ${isActive ? 'active' : ''}`}
      onClick={() => onSort(field)}
    >
      <span className="sortable-header__label">{label}</span>
      <span className={`sortable-header__icon ${isActive && currentSortOrder === 'asc' ? 'reversed' : ''}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2L11 6H5L8 2Z" fill="currentColor" />
          <path d="M8 14L11 10H5L8 14Z" fill="currentColor" opacity="0.3" />
        </svg>
      </span>
    </div>
  );
};

export default SortableHeader;