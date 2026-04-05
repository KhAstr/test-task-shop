import useProducts from "../hooks/useProducts";
import { useState, useCallback, type JSX } from "react";
import { useProductSearch } from "../hooks/useProductSearch";
import { useSorting, type SortField } from "../hooks/useSorting";
import Search from "./Search";
import SortableHeader from "./SortableHeader";
import type { AddProduct, Product } from "../types/Product";
import Pagination from "./Pagination";
import Modal from "./Modal";
import AddProductForm from "./AddProductForm";
import Toast from "./Toast";
import "./ProductsList.css";

const ProductsList = (): JSX.Element => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const limit = 10;
    const skip = (page - 1) * limit;
    const shownPages = `${page * limit - (limit - 1)}-${page * limit}`;

    const { sorting, toggleSort } = useSorting('title', 'asc');

    
    const handleToggleSort = useCallback((field: SortField) => {
        toggleSort(field);
        setPage(1); 
    }, [toggleSort]);

    const isSearching = searchQuery.trim().length > 0;

    const searchQueryResult = useProductSearch({
        searchQuery,
        page,
        limit,
        sortField: sorting.field,
        sortOrder: sorting.order,
    });

    const productsQueryResult = useProducts({
        limit,
        skip,
        sortField: sorting.field,
        sortOrder: sorting.order,
    });

    const {
        data,
        isLoading,
        isFetching,
        error,
        refetch
    } = isSearching ? searchQueryResult : productsQueryResult;

    
    const handleAddProduct = useCallback((newProduct: AddProduct) => {
        
        const maxId = data?.products?.reduce((max, p) => Math.max(max, p.id), 0) || 0;

        const productToAdd: Product = {
            ...newProduct,
            id: maxId + 1,
            sku: newProduct.sku,
            thumbnail: "https://via.placeholder.com/100",
            images: [],
            meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                barcode: "",
            },
            availabilityStatus: "In Stock",
            minimumOrderQuantity: 1,
            description: newProduct.description || "",
            discountPercentage: 0,
            stock: 100,
            weight: 0,
            dimensions: { width: 0, height: 0, depth: 0 },
            warrantyInformation: "",
            returnPolicy: "",
        };

        
        console.log("Добавлен товар:", productToAdd);

        
        setIsModalOpen(false);

        
        setToast({
            message: `Товар "${newProduct.title}" успешно добавлен!`,
            type: "success",
        });

        
    }, [data]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setPage(1);
    }, []);

    const totalProducts = data ? data.total : null;
    const totalPages = data ? Math.ceil(data.total / limit) : 0;

    const handlePageChange = useCallback((newPage: number) => {
        if (!isFetching && newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }, [isFetching, totalPages]);

    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}


            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавление товара">
                <AddProductForm
                    onSubmit={handleAddProduct}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={isFetching}
                />
            </Modal>
            {(isLoading || isFetching) && (
                <div className="progress-bar-container">
                    <div className="progress-bar">
                        <div className="progress-bar__fill"></div>
                    </div>
                    <div className="progress-bar__text">
                        {isLoading ? 'Загрузка данных...' : 'Обновление...'}
                    </div>
                </div>
            )}

            <Search onSearch={handleSearch} isLoading={isFetching} />
            <div className="products-hero">
                <div className="products-header">
                    <h3>Все позиции</h3>
                </div>
                <button onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? 'Обновление...' : 'Обновить'}
            </button>
            <button
                onClick={() => setIsModalOpen(true)}
                className="add-button"
                disabled={isFetching}
            >
                + Добавить
            </button>
            </div>
            

            {!isLoading && data && (
                <>
                    <div className="products-headers">
                        <div className="products-headers__checkbox"></div>
                        <SortableHeader
                            label="Наименование"
                            field="title"
                            currentSortField={sorting.field}
                            currentSortOrder={sorting.order}
                            onSort={handleToggleSort}
                            className="products-headers__name"
                        />
                        <SortableHeader
                            label="Вендор"
                            field="brand"
                            currentSortField={sorting.field}
                            currentSortOrder={sorting.order}
                            onSort={handleToggleSort}
                            className="products-headers__brand"
                        />
                        <SortableHeader
                            label="Артикул"
                            field="sku"
                            currentSortField={sorting.field}
                            currentSortOrder={sorting.order}
                            onSort={handleToggleSort}
                            className="products-headers__article"
                        />
                        <SortableHeader
                            label="Оценка"
                            field="rating"
                            currentSortField={sorting.field}
                            currentSortOrder={sorting.order}
                            onSort={handleToggleSort}
                            className="products-headers__rating"
                        />
                        <SortableHeader
                            label="Цена"
                            field="price"
                            currentSortField={sorting.field}
                            currentSortOrder={sorting.order}
                            onSort={handleToggleSort}
                            className="products-headers__price"
                        />
                        <div className="products-headers__buttons">Кнопки</div>
                    </div>

                    {data.products.length === 0 && isSearching ? (
                        <div className="no-results">
                            <p>Ничего не найдено по запросу "{searchQuery}"</p>
                        </div>
                    ) : (
                        <ul className="products-list">
                            {data.products.map((product: Product) => {
                                let ratingColor: string = '';
                                if (product.rating && product.rating < 3.5) {
                                    ratingColor = 'red';
                                }

                                return (
                                    <li key={product.id} className="products-list__item list-item">
                                        <div className="list-item__checkbox">
                                            <input type="checkbox" />
                                        </div>
                                        <div className="list-item__img">
                                            <img src={product.thumbnail} alt={product.title} />
                                        </div>
                                        <div className="list-item__basic-info basic-info">
                                            <div className="basic-info__name">{product.title}</div>
                                            <div className="basic-info__category">{product.category}</div>
                                        </div>
                                        <div className="list-item__brand">{product.brand || '—'}</div>
                                        <div className="list-item__article">{product.sku}</div>
                                        <div className="list-item__rating">
                                            <span data-color={ratingColor}>{product.rating || '—'}</span>/5
                                        </div>
                                        <div className="list-item__price">{product.price ? `$${product.price.toFixed(2)}` : '—'}</div>
                                        <div className="list-item__buttons">Кнопки</div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="pagination">
                        <Pagination
                            currentPage={page}
                            shownPages={shownPages}
                            totalPages={totalPages}
                            totalProducts={totalProducts || 0}
                            onPageChange={handlePageChange}
                            isLoading={isFetching}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductsList;