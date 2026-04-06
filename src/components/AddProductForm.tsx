import { useState, type JSX } from "react";
import { useUIStore } from "../stores/uiStore";
import type { AddProduct } from "../types/Product";
import "./AddProductForm.css";

const AddProductForm = (): JSX.Element => {
  const { closeModal, showToast, isLoading } = useUIStore();
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    brand: "",
    sku: "",
    category: "",
    rating: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Наименование обязательно";
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Цена должна быть больше 0";
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = "Артикул обязателен";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const newProduct: AddProduct = {
      title: formData.title.trim(),
      price: Number(formData.price),
      brand: formData.brand.trim() || "Без бренда",
      sku: formData.sku.trim(),
      category: formData.category.trim() || "other",
      rating: formData.rating ? Number(formData.rating) : 0,
      description: formData.description.trim() || "",
    };
    
    console.log("Добавлен товар:", newProduct);
    
    closeModal();
    showToast(`Товар "${newProduct.title}" успешно добавлен!`, 'success');
    
    setFormData({
      title: "",
      price: "",
      brand: "",
      sku: "",
      category: "",
      rating: "",
      description: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancel = () => {
    closeModal();
    setFormData({
      title: "",
      price: "",
      brand: "",
      sku: "",
      category: "",
      rating: "",
      description: "",
    });
    setErrors({});
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">
          Наименование <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? "error" : ""}
          disabled={isLoading}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">
            Цена <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={errors.price ? "error" : ""}
            disabled={isLoading}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sku">
            Артикул <span className="required">*</span>
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={errors.sku ? "error" : ""}
            disabled={isLoading}
          />
          {errors.sku && <span className="error-message">{errors.sku}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="brand">Вендор</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Например: Apple, Samsung..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Рейтинг (0-5)</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="5"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Категория</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Например: electronics, clothing..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={isLoading}
          placeholder="Краткое описание товара..."
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={handleCancel} disabled={isLoading}>
          Отмена
        </button>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Добавление..." : "Добавить товар"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;