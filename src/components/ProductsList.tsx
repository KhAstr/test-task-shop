import { useEffect, useCallback } from "react";
import useProductsData from "../hooks/useProductsData";
import { useFiltersStore } from "../stores/filtersStore";
import { useUIStore } from "../stores/uiStore";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";
import type { Product } from "../types/Product";
import type { SortField } from "../types/sorting";
import "./ProductsList.css";

const ProductsList = () => {
    const searchQuery = useFiltersStore((state) => state.searchQuery);
    const sortField = useFiltersStore((state) => state.sortField);
    const sortOrder = useFiltersStore((state) => state.sortOrder);
    const setSorting = useFiltersStore((state) => state.setSorting);
    const setPage = useFiltersStore((state) => state.setPage);

    const openModal = useUIStore((state) => state.openModal);
    const setLoading = useUIStore((state) => state.setLoading);
    const showToast = useUIStore((state) => state.showToast);

    const { data, isLoading, isFetching, error, refetch } = useProductsData();

    const isSearching = searchQuery.trim().length > 0;


    useEffect(() => {
        setPage(1);
    }, [searchQuery, sortField, sortOrder, setPage]);

    const toggleSort = useCallback(
        (field: SortField) => {
            const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
            setSorting(field, newOrder);
        },
        [sortField, sortOrder, setSorting]
    );

    const handleRefresh = useCallback(async () => {
        setLoading(true);
        await refetch();
        setLoading(false);
        showToast("Данные обновлены", "success");
    }, [refetch, setLoading, showToast]);

    const handleAddClick = () => {
        openModal();
    };

    if (error) {
        return (
            <div className="error-container">
                <p>Ошибка: {error.message}</p>
                <button onClick={handleRefresh}>Повторить</button>
            </div>
        );
    }

    return (
        <div className="products-list-container">
            <div className="products-toolbar">
                <div className="products-toolbar__title">
                    <h3>Все позиции</h3>
                </div>
                <div className="products-toolbar__buttons">
                    <button onClick={handleRefresh} disabled={isFetching} className={isFetching ? "refresh-button refresh-button--spinning" : "refresh-button"}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.2373 13.2662C14.3656 13.395 14.4376 13.5695 14.4376 13.7513C14.4376 13.9331 14.3656 14.1076 14.2373 14.2364C14.1436 14.3284 11.9298 16.5 8.25 16.5C5.0368 16.5 2.70445 14.575 1.375 13.0754V15.125C1.375 15.3073 1.30257 15.4822 1.17364 15.6111C1.0447 15.7401 0.869836 15.8125 0.6875 15.8125C0.505164 15.8125 0.330295 15.7401 0.201364 15.6111C0.072433 15.4822 0 15.3073 0 15.125V11C0 10.8177 0.072433 10.6428 0.201364 10.5139C0.330295 10.3849 0.505164 10.3125 0.6875 10.3125H4.8125C4.99484 10.3125 5.1697 10.3849 5.29864 10.5139C5.42757 10.6428 5.5 10.8177 5.5 11C5.5 11.1823 5.42757 11.3572 5.29864 11.4861C5.1697 11.6151 4.99484 11.6875 4.8125 11.6875H2.01437C3.07312 13.0066 5.24219 15.125 8.25 15.125C11.3438 15.125 13.2464 13.2808 13.2653 13.2619C13.3948 13.1336 13.5699 13.062 13.7522 13.0628C13.9344 13.0636 14.1089 13.1368 14.2373 13.2662ZM15.8125 0.6875C15.6302 0.6875 15.4553 0.759933 15.3264 0.888864C15.1974 1.0178 15.125 1.19266 15.125 1.375V3.42461C13.7955 1.925 11.4632 0 8.25 0C4.57016 0 2.35641 2.17164 2.26359 2.26359C2.13436 2.39237 2.06158 2.56721 2.06126 2.74964C2.06094 2.93208 2.1331 3.10718 2.26187 3.23641C2.39065 3.36564 2.56549 3.43842 2.74793 3.43874C2.93036 3.43906 3.10546 3.3669 3.23469 3.23813C3.25359 3.21922 5.15625 1.375 8.25 1.375C11.2578 1.375 13.4269 3.49336 14.4856 4.8125H11.6875C11.5052 4.8125 11.3303 4.88493 11.2014 5.01386C11.0724 5.1428 11 5.31766 11 5.5C11 5.68234 11.0724 5.8572 11.2014 5.98614C11.3303 6.11507 11.5052 6.1875 11.6875 6.1875H15.8125C15.9948 6.1875 16.1697 6.11507 16.2986 5.98614C16.4276 5.8572 16.5 5.68234 16.5 5.5V1.375C16.5 1.19266 16.4276 1.0178 16.2986 0.888864C16.1697 0.759933 15.9948 0.6875 15.8125 0.6875Z" fill="#515161" />
                        </svg>

                    </button>
                    <button onClick={handleAddClick} className="add-product-button">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M8.9375 0C7.16983 0 5.44186 0.524175 3.97209 1.50624C2.50233 2.48831 1.35679 3.88415 0.680331 5.51727C0.00387248 7.15038 -0.17312 8.94741 0.171736 10.6811C0.516591 12.4148 1.36781 14.0073 2.61774 15.2573C3.86767 16.5072 5.46018 17.3584 7.19388 17.7033C8.92759 18.0481 10.7246 17.8711 12.3577 17.1947C13.9909 16.5182 15.3867 15.3727 16.3688 13.9029C17.3508 12.4331 17.875 10.7052 17.875 8.9375C17.8725 6.5679 16.9301 4.29606 15.2545 2.6205C13.5789 0.944933 11.3071 0.00250234 8.9375 0ZM8.9375 16.5C7.44178 16.5 5.97965 16.0565 4.736 15.2255C3.49236 14.3945 2.52305 13.2134 1.95066 11.8315C1.37828 10.4497 1.22851 8.92911 1.52032 7.46213C1.81212 5.99515 2.53237 4.64764 3.59001 3.59001C4.64764 2.53237 5.99515 1.81211 7.46213 1.52031C8.92911 1.22851 10.4497 1.37827 11.8315 1.95066C13.2134 2.52305 14.3945 3.49235 15.2255 4.736C16.0565 5.97965 16.5 7.44178 16.5 8.9375C16.4977 10.9425 15.7002 12.8647 14.2825 14.2825C12.8647 15.7002 10.9425 16.4977 8.9375 16.5ZM13.0625 8.9375C13.0625 9.11984 12.9901 9.29471 12.8611 9.42364C12.7322 9.55257 12.5573 9.625 12.375 9.625H9.625V12.375C9.625 12.5573 9.55257 12.7322 9.42364 12.8611C9.29471 12.9901 9.11984 13.0625 8.9375 13.0625C8.75517 13.0625 8.5803 12.9901 8.45137 12.8611C8.32244 12.7322 8.25 12.5573 8.25 12.375V9.625H5.5C5.31767 9.625 5.1428 9.55257 5.01387 9.42364C4.88494 9.29471 4.8125 9.11984 4.8125 8.9375C4.8125 8.75516 4.88494 8.5803 5.01387 8.45136C5.1428 8.32243 5.31767 8.25 5.5 8.25H8.25V5.5C8.25 5.31766 8.32244 5.1428 8.45137 5.01386C8.5803 4.88493 8.75517 4.8125 8.9375 4.8125C9.11984 4.8125 9.29471 4.88493 9.42364 5.01386C9.55257 5.1428 9.625 5.31766 9.625 5.5V8.25H12.375C12.5573 8.25 12.7322 8.32243 12.8611 8.45136C12.9901 8.5803 13.0625 8.75516 13.0625 8.9375Z" fill="white" />
                        </svg></span>
                        Добавить
                    </button>
                </div>
            </div>

            {(isLoading || isFetching) && (
                <div className="progress-bar-container">
                    <div className="progress-bar">
                        <div className="progress-bar__fill"></div>
                    </div>
                    <div className="progress-bar__text">
                        {isLoading ? "Загрузка данных..." : "Обновление..."}
                    </div>
                </div>
            )}

            {!isLoading && data && (
                <>
                    <div className="products-headers">
                        <div className="products-headers__checkbox">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    // checked={selectAll}
                                    // onChange={handleSelectAll}
                                    className="checkbox"
                                />
                                <span className="checkbox-custom"></span>
                            </label>
                        </div>
                        <SortableHeader
                            label="Наименование"
                            field="title"
                            currentSortField={sortField}
                            currentSortOrder={sortOrder}
                            onSort={toggleSort}
                            className="products-headers__name"
                        />
                        <SortableHeader
                            label="Вендор"
                            field="brand"
                            currentSortField={sortField}
                            currentSortOrder={sortOrder}
                            onSort={toggleSort}
                            className="products-headers__brand"
                        />
                        <SortableHeader
                            label="Артикул"
                            field="sku"
                            currentSortField={sortField}
                            currentSortOrder={sortOrder}
                            onSort={toggleSort}
                            className="products-headers__article"
                        />
                        <SortableHeader
                            label="Оценка"
                            field="rating"
                            currentSortField={sortField}
                            currentSortOrder={sortOrder}
                            onSort={toggleSort}
                            className="products-headers__rating"
                        />
                        <SortableHeader
                            label="Цена, &#8381;"
                            field="price"
                            currentSortField={sortField}
                            currentSortOrder={sortOrder}
                            onSort={toggleSort}
                            className="products-headers__price"
                        />
                    </div>

                    {data.products.length === 0 && isSearching ? (
                        <div className="no-results">
                            <p>Ничего не найдено по запросу "{searchQuery}"</p>
                            <button onClick={() => useFiltersStore.getState().setSearchQuery("")}>
                                Очистить поиск
                            </button>
                        </div>
                    ) : (
                        <ul className="products-list">
                            {data.products.map((product: Product) => {
                                const ratingColor = product.rating && product.rating < 3.5 ? "red" : "";
                                const [integer, decimal] = product.price ? product.price.toFixed(2).split(".") : '—';
                                return (
                                    <li key={product.id} className="products-list__item list-item">
                                        <div className="list-item__checkbox">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    // checked={isSelected}
                                                    // onChange={() => handleSelectProduct(product.id)}
                                                    className="checkbox"
                                                />
                                                <span className="checkbox-custom"></span>
                                            </label>
                                        </div>
                                        <div className="list-item__img">
                                            <img src={product.thumbnail} alt={product.title} />
                                        </div>
                                        <div className="list-item__basic-info basic-info">
                                            <div className="basic-info__name">{product.title}</div>
                                            <div className="basic-info__category">{product.category}</div>
                                        </div>
                                        <div className="list-item__brand">{product.brand || "—"}</div>
                                        <div className="list-item__article">{product.sku}</div>
                                        <div className="list-item__rating">
                                            <span data-color={ratingColor}>{product.rating || "—"}</span>/5
                                        </div>
                                        <div className="list-item__price">
                                            <span className="price-integer">{integer}</span>
                                            <span className="price-decimal">,{decimal}</span>
                                        </div>
                                        <div className="list-item__buttons">
                                            <button className="btn-add">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button className="btn-more">
                                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9964 9.5533 24.6256 6.24882 22.1884 3.81163C19.7512 1.37445 16.4467 0.00363977 13 0ZM13 24C10.8244 24 8.69767 23.3549 6.88873 22.1462C5.07979 20.9375 3.66989 19.2195 2.83733 17.2095C2.00477 15.1995 1.78693 12.9878 2.21137 10.854C2.63581 8.72022 3.68345 6.7602 5.22183 5.22183C6.76021 3.68345 8.72022 2.6358 10.854 2.21136C12.9878 1.78692 15.1995 2.00476 17.2095 2.83733C19.2195 3.66989 20.9375 5.07979 22.1462 6.88873C23.3549 8.69767 24 10.8244 24 13C23.9967 15.9164 22.8367 18.7123 20.7745 20.7745C18.7123 22.8367 15.9164 23.9967 13 24ZM14.5 13C14.5 13.2967 14.412 13.5867 14.2472 13.8334C14.0824 14.08 13.8481 14.2723 13.574 14.3858C13.2999 14.4993 12.9983 14.5291 12.7074 14.4712C12.4164 14.4133 12.1491 14.2704 11.9393 14.0607C11.7296 13.8509 11.5867 13.5836 11.5288 13.2926C11.471 13.0017 11.5007 12.7001 11.6142 12.426C11.7277 12.1519 11.92 11.9176 12.1667 11.7528C12.4133 11.588 12.7033 11.5 13 11.5C13.3978 11.5 13.7794 11.658 14.0607 11.9393C14.342 12.2206 14.5 12.6022 14.5 13ZM20 13C20 13.2967 19.912 13.5867 19.7472 13.8334C19.5824 14.08 19.3481 14.2723 19.074 14.3858C18.7999 14.4993 18.4983 14.5291 18.2074 14.4712C17.9164 14.4133 17.6491 14.2704 17.4393 14.0607C17.2296 13.8509 17.0867 13.5836 17.0288 13.2926C16.9709 13.0017 17.0007 12.7001 17.1142 12.426C17.2277 12.1519 17.42 11.9176 17.6667 11.7528C17.9133 11.588 18.2033 11.5 18.5 11.5C18.8978 11.5 19.2794 11.658 19.5607 11.9393C19.842 12.2206 20 12.6022 20 13ZM9.00001 13C9.00001 13.2967 8.91203 13.5867 8.74721 13.8334C8.58239 14.08 8.34812 14.2723 8.07403 14.3858C7.79994 14.4993 7.49834 14.5291 7.20737 14.4712C6.9164 14.4133 6.64912 14.2704 6.43935 14.0607C6.22957 13.8509 6.08671 13.5836 6.02883 13.2926C5.97095 13.0017 6.00065 12.7001 6.11419 12.426C6.22772 12.1519 6.41998 11.9176 6.66665 11.7528C6.91332 11.588 7.20333 11.5 7.50001 11.5C7.89783 11.5 8.27936 11.658 8.56067 11.9393C8.84197 12.2206 9.00001 12.6022 9.00001 13Z" fill="#B2B3B9" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <Pagination />
                </>
            )}
        </div>
    );
};

export default ProductsList;