import { type JSX } from "react";

interface PaginationProps {
    currentPage: number;
    shownPages: string;
    totalPages: number;
    totalProducts: number
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

const Pagination = ({
    currentPage,
    shownPages,
    totalPages,
    totalProducts,
    onPageChange,
    isLoading = false
}: PaginationProps): JSX.Element => {

    const getPageRange = () => {
        const delta = 2;
        let start = Math.max(1, currentPage - delta);
        let end = Math.min(totalPages, currentPage + delta);

        if (end - start + 1 < 5) {
            if (start === 1) {
                end = Math.min(totalPages, start + 4);
            } else if (end === totalPages) {
                start = Math.max(1, end - 4);
            }
        }

        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        console.log(range);
        return range;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <div className="">Показано{shownPages} из {totalProducts}</div>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
            >
                Назад
            </button>

            {getPageRange().map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage || isLoading}
                    className={page === currentPage ? 'active' : ''}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
            >
                Вперёд
            </button>
        </div>
    );
};

export default Pagination;