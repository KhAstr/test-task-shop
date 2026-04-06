import { type JSX } from "react";
import { useFiltersStore } from "../stores/filtersStore";
import { useUIStore } from "../stores/uiStore";
import useProductsData from "../hooks/useProductsData";
import "./Pagination.css";

const Pagination = (): JSX.Element => {
    const { page, setPage, limit } = useFiltersStore();
    const { isLoading } = useUIStore();

    const { data } = useProductsData();

    const totalProducts = data?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalProducts);
    const shownPages = `${startItem}-${endItem}`;

    const getPageRange = (): number[] => {
        const delta = 2;
        let start = Math.max(1, page - delta);
        let end = Math.min(totalPages, page + delta);

        if (end - start + 1 < 5) {
            if (start === 1) {
                end = Math.min(totalPages, start + 4);
            } else if (end === totalPages) {
                start = Math.max(1, end - 4);
            }
        }

        const range: number[] = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    const handlePageChange = (newPage: number) => {
        if (!isLoading && newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <div className="pagination__info">
                Показано <span className="pagination__info--black">{shownPages}</span> из <span className="pagination__info--black">{totalProducts}</span>
            </div>

            <div className="pagination__controls">
                <button
                    className="pagination__button pagination__button--arrow"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isLoading}
                >
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.31768 12.6832C7.37575 12.7412 7.42181 12.8102 7.45324 12.886C7.48466 12.9619 7.50084 13.0432 7.50084 13.1253C7.50084 13.2075 7.48466 13.2888 7.45324 13.3647C7.42181 13.4405 7.37575 13.5095 7.31768 13.5675C7.25961 13.6256 7.19067 13.6717 7.1148 13.7031C7.03893 13.7345 6.95761 13.7507 6.87549 13.7507C6.79337 13.7507 6.71205 13.7345 6.63618 13.7031C6.56031 13.6717 6.49137 13.6256 6.4333 13.5675L0.183304 7.31754C0.125194 7.25949 0.0790947 7.19056 0.047642 7.11469C0.0161893 7.03881 0 6.95748 0 6.87535C0 6.79321 0.0161893 6.71188 0.047642 6.63601C0.0790947 6.56014 0.125194 6.49121 0.183304 6.43316L6.4333 0.18316C6.55058 0.0658846 6.70964 -3.26935e-09 6.87549 0C7.04134 3.26935e-09 7.2004 0.0658846 7.31768 0.18316C7.43495 0.300435 7.50084 0.459495 7.50084 0.625347C7.50084 0.7912 7.43495 0.95026 7.31768 1.06753L1.50909 6.87535L7.31768 12.6832Z" fill="#B2B3B9" />
                    </svg>
                </button>

                {getPageRange().map(p => (
                    <button
                        key={p}
                        className={`pagination__button ${p === page ? 'pagination__button--active' : ''}`}
                        onClick={() => handlePageChange(p)}
                        disabled={p === page || isLoading}
                    >
                        {p}
                    </button>
                ))}

                <button
                    className="pagination__button pagination__button--arrow"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || isLoading}
                >
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.31754 7.31754L1.06754 13.5675C1.00947 13.6256 0.940528 13.6717 0.864658 13.7031C0.788787 13.7345 0.707469 13.7507 0.625347 13.7507C0.543226 13.7507 0.461908 13.7345 0.386037 13.7031C0.310167 13.6717 0.241229 13.6256 0.18316 13.5675C0.125091 13.5095 0.0790281 13.4405 0.0476015 13.3647C0.0161748 13.2888 0 13.2075 0 13.1253C0 13.0432 0.0161748 12.9619 0.0476015 12.886C0.0790281 12.8102 0.125091 12.7412 0.18316 12.6832L5.99175 6.87535L0.18316 1.06753C0.0658843 0.95026 -1.2357e-09 0.7912 0 0.625347C1.2357e-09 0.459495 0.0658843 0.300435 0.18316 0.18316C0.300435 0.0658846 0.459495 1.2357e-09 0.625347 0C0.7912 -1.2357e-09 0.95026 0.0658846 1.06754 0.18316L7.31754 6.43316C7.37565 6.49121 7.42175 6.56014 7.4532 6.63601C7.48465 6.71188 7.50084 6.79321 7.50084 6.87535C7.50084 6.95748 7.48465 7.03881 7.4532 7.11469C7.42175 7.19056 7.37565 7.25949 7.31754 7.31754Z" fill="#B2B3B9" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;