import { useState, useEffect } from "react";
import {
    getLowStockProducts, getProductSales, getTopRatedProducts,
    updateStock, createProduct,
    getAllProducts, updateProduct, deleteProduct,
} from "../../../api/adminApi";
import styles from "../admin.module.css";

const ProductsTab = () => {
    const labelStyle = {
        fontSize: "11px", color: "rgba(255,255,255,0.5)",
        display: "block", marginBottom: "4px", marginTop: "10px"
    };

    const inputStyle = {
        width: "100%", padding: "8px 12px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "8px", color: "white",
        fontSize: "13px", outline: "none",
        boxSizing: "border-box",
    };

    const [lowStock, setLowStock] = useState([]);
    const [sales, setSales] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeSection, setActiveSection] = useState("list");
    const [stockInputs, setStockInputs] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editData, setEditData] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: "", description: "", price: "",
        originalPrice: "", onSale: false,
        stock: "", categoryId: "", imageCount: 1,
        attributes: {
            size: "", rarity: "", quality: "",
            manufacturer: "", animatedCartoon: ""
        }
    });

    const validateProduct = () => {
        if (!newProduct.name.trim()) return "Name is required";
        if (!newProduct.price || parseFloat(newProduct.price) <= 0)
            return "Price must be positive";
        if (!newProduct.categoryId) return "Category is required";
        if (!newProduct.stock || parseInt(newProduct.stock) < 0)
            return "Stock cannot be negative";
        return null;
    };

    useEffect(() => {
        getLowStockProducts().then(setLowStock);
        getProductSales().then(setSales);
        getTopRatedProducts().then(setTopRated);
        getAllProducts().then(setProducts);
    }, []);

    const handleUpdateStock = async (id) => {
        const newStock = stockInputs[id];
        if (!newStock) return;
        await updateStock(id, parseInt(newStock));
        const updated = await getLowStockProducts();
        setLowStock(updated);
        setStockInputs(prev => ({ ...prev, [id]: "" }));
    };

    const handleSelectProduct = (product) => {
        if(selectedProduct != null && editData != null) {
            setSelectedProduct(null);
            setEditData(null);

            return;
        }
        setSelectedProduct(product);
        let attrs = product.attributes;
        if (typeof attrs === "string") {
            try { attrs = JSON.parse(attrs); } catch { attrs = {}; }
        }

        setEditData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            originalPrice: product.originalPrice || "",
            onSale: product.onSale || false,
            stock: product.stock || "",
            categoryId: product.categoryId,
            mainImageIndex: 1,
            attributes: {
                size: attrs?.size || "",
                rarity: attrs?.rarity || "",
                quality: attrs?.quality || "",
                manufacturer: attrs?.manufacturer || "",
                animatedCartoon: attrs?.animatedCartoon || "",
            }
        });
    };

    const handleSaveProduct = async () => {
        const payload = {
            name: editData.name,
            description: editData.description,
            price: parseFloat(editData.price),
            originalPrice: parseFloat(editData.originalPrice) || 0,
            onSale: editData.onSale,
            stock: parseInt(editData.stock),
            categoryId: editData.categoryId ? parseInt(editData.categoryId) : null,
            mainImageIndex: editData.mainImageIndex,
            attributes: editData.attributes,
        };


        await updateProduct(selectedProduct.id, payload);
        const updated = await getAllProducts();
        setProducts(updated);

        const refreshed = updated.find(p => p.id === selectedProduct.id);
        if (refreshed) {
            setSelectedProduct(refreshed);
            setEditData(prev => ({ ...prev, mainImageIndex: 1 }));
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
        if (selectedProduct?.id === id) {
            setSelectedProduct(null);
            setEditData(null);
        }
    };

    const handleCreateProduct = async () => {
        const error = validateProduct();
        if (error) {
            alert(error);
            return;
        }
        try {
            await createProduct({
                ...newProduct,
                price: parseFloat(newProduct.price),
                originalPrice: parseFloat(newProduct.originalPrice) || 0,
                stock: parseInt(newProduct.stock) || 0,
                categoryId: parseInt(newProduct.categoryId),
            });
            alert("Product created!");
            const updated = await getAllProducts();
            setProducts(updated);
            setNewProduct({
                name: "", description: "", price: "",
                originalPrice: "", onSale: false,
                stock: "", categoryId: "", imageCount: 1,
                attributes: { size: "", rarity: "", quality: "", manufacturer: "", animatedCartoon: "" }
            });
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Products</h1>
            <div className={styles.tabs}>
                {[
                    { id: "list", label: "All Products" },
                    { id: "lowStock", label: "Low Stock" },
                    { id: "sales", label: "Sales" },
                    { id: "topRated", label: "Top Rated" },
                    { id: "create", label: "Create" },
                ].map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)}
                            className={activeSection === s.id ? styles.activeTab : ""}>
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Список всех продуктов */}
            {activeSection === "list" && (
                <div style={{ display: "flex", gap: "24px" }}>
                    {/* Таблица */}
                    <div style={{ flex: 1 }}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={{
                                    background: selectedProduct?.id === p.id
                                        ? "rgba(167,139,250,0.08)" : ""
                                }}>
                                    <td>{p.id}</td>
                                    <td>
                                        <img
                                            src={p.images?.[0] || ""}
                                            alt={p.name}
                                            style={{
                                                width: "48px", height: "48px",
                                                objectFit: "cover", borderRadius: "6px"
                                            }}
                                        />
                                    </td>
                                    <td>{p.name}</td>
                                    <td>{p.categoryName}</td>
                                    <td>{p.price}¥</td>
                                    <td style={{
                                        color: p.stock < 5 ? "#ef4444"
                                            : p.stock < 20 ? "#eab308" : "#22c55e"
                                    }}>
                                        {p.stock}
                                    </td>
                                    <td style={{ display: "flex", gap: "6px" }}>
                                        <button
                                            onClick={() => handleSelectProduct(p)}
                                            className={styles.detailsBtn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(p.id)}
                                            className={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Форма редактирования */}
                    {selectedProduct && editData && (
                        <div style={{
                            width: "340px", flexShrink: 0,
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "12px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            padding: "20px",
                            height: "fit-content",
                        }}>
                            <h3 style={{marginBottom: "16px", color: "white"}}>
                                Edit #{selectedProduct.id}
                            </h3>

                            {/* Картинки */}
                            <div style={{display: "flex", gap: "8px", marginBottom: "16px"}}>
                                {selectedProduct.images?.map((img, i) => (
                                    <div key={i} style={{position: "relative"}}>
                                        <img src={img} alt=""
                                             style={{
                                                 width: "60px", height: "60px",
                                                 objectFit: "cover", borderRadius: "6px",
                                                 border: editData.mainImageIndex === i + 1
                                                     ? "2px solid #a78bfa"
                                                     : "2px solid transparent",
                                                 cursor: "pointer",
                                             }}
                                             onClick={() => setEditData(prev => ({
                                                 ...prev, mainImageIndex: i + 1
                                             }))}
                                        />
                                        {editData.mainImageIndex === i + 1 && (
                                            <span style={{
                                                position: "absolute", top: "2px", right: "2px",
                                                background: "#a78bfa", borderRadius: "50%",
                                                width: "14px", height: "14px",
                                                fontSize: "9px", display: "flex",
                                                alignItems: "center", justifyContent: "center",
                                                color: "white",
                                            }}>★</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p style={{fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "12px"}}>
                                Click image to set as main
                            </p>

                            {/* Поля */}
                            <label style={labelStyle}>Name</label>
                            <input type="text" value={editData.name}
                                   onChange={e => setEditData(prev => ({...prev, name: e.target.value}))}
                                   style={inputStyle}/>

                            <label style={labelStyle}>Description</label>
                            <input type="text" value={editData.description}
                                   onChange={e => setEditData(prev => ({...prev, description: e.target.value}))}
                                   style={inputStyle}/>

                            <label style={labelStyle}>Price</label>
                            <input
                                type="number"
                                value={editData.price}
                                onChange={e => {
                                    setEditData(prev => ({...prev, price: e.target.value}));
                                }}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>Original Price</label>
                            <input type="number" value={editData.originalPrice}
                                   onChange={e => setEditData(prev => ({...prev, originalPrice: e.target.value}))}
                                   style={inputStyle}/>

                            <label style={labelStyle}>Stock</label>
                            <input type="number" value={editData.stock}
                                   onChange={e => setEditData(prev => ({...prev, stock: e.target.value}))}
                                   style={inputStyle}/>

                            <label style={labelStyle}>Category ID (optional)</label>
                            <input type="number" value={editData.categoryId}
                                   onChange={e => setEditData(prev => ({...prev, categoryId: e.target.value}))}
                                   style={inputStyle}/>


                            <label style={{
                                display: "flex", alignItems: "center",
                                gap: "8px", color: "rgba(255,255,255,0.7)",
                                fontSize: "13px", marginBottom: "12px",
                            }}>
                                <input
                                    type="checkbox"
                                    checked={editData.onSale}
                                    onChange={e => setEditData(prev => ({
                                        ...prev, onSale: e.target.checked
                                    }))}
                                />
                                On Sale
                            </label>

                            <h4 style={{
                                fontSize: "12px", color: "rgba(255,255,255,0.5)",
                                marginBottom: "8px", textTransform: "uppercase"
                            }}>
                                Attributes
                            </h4>
                            {["size", "rarity", "quality", "manufacturer", "animatedCartoon"].map(attr => (
                                <div key={attr} style={{marginBottom: "8px"}}>
                                    <label style={{
                                        fontSize: "11px",
                                        color: "rgba(255,255,255,0.4)",
                                        display: "block", marginBottom: "3px"
                                    }}>
                                        {attr}
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.attributes[attr]}
                                        onChange={e => setEditData(prev => ({
                                            ...prev,
                                            attributes: {...prev.attributes, [attr]: e.target.value}
                                        }))}
                                        style={{
                                            width: "100%", padding: "7px 10px",
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            borderRadius: "6px", color: "white",
                                            fontSize: "12px", outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                            ))}

                            <div style={{display: "flex", gap: "8px", marginTop: "16px"}}>
                                <button
                                    onClick={handleSaveProduct}
                                    className={styles.createBtn}
                                    style={{flex: 1}}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        setEditData(null);
                                    }}
                                    style={{
                                        padding: "10px 16px", borderRadius: "8px",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        background: "transparent", color: "white",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Low Stock */}
            {activeSection === "lowStock" && (
                <table className={styles.table}>
                    <thead>
                    <tr>
                    <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Update</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lowStock.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.categoryName}</td>
                            <td style={{color: p.stockQuantity < 5 ? "red" : "orange"}}>
                                {p.stockQuantity}
                            </td>
                            <td>
                                <input
                                    type="number" placeholder="New stock"
                                    value={stockInputs[p.id] || ""}
                                    onChange={e => setStockInputs(prev => ({
                                        ...prev, [p.id]: e.target.value
                                    }))}
                                    className={styles.stockInput}
                                />
                                <button onClick={() => handleUpdateStock(p.id)}>Update</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Sales */}
            {activeSection === "sales" && (
                <table className={styles.table}>
                    <thead>
                    <tr><th>Product</th><th>Total Sold</th><th>Revenue</th></tr>
                    </thead>
                    <tbody>
                    {sales.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.totalSold}</td>
                            <td>{p.revenue}¥</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Top Rated */}
            {activeSection === "topRated" && (
                <table className={styles.table}>
                    <thead>
                    <tr><th>Product</th><th>Rating</th><th>Reviews</th></tr>
                    </thead>
                    <tbody>
                    {topRated.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>⭐ {p.averageRating}</td>
                            <td>{p.reviewsCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Create */}
            {activeSection === "create" && (
                <div className="formWrapper">
                    <h2>Create Product</h2>
                    {["name", "description", "price", "originalPrice", "stock", "categoryId"].map(field => (
                        <input
                            key={field}
                            type={["price", "originalPrice", "stock", "categoryId"].includes(field) ? "number" : "text"}
                            placeholder={field}
                            value={newProduct[field]}
                            onChange={e => setNewProduct(prev => ({ ...prev, [field]: e.target.value }))}
                        />
                    ))}
                    <label>
                        On Sale:
                        <input type="checkbox" checked={newProduct.onSale}
                               onChange={e => setNewProduct(prev => ({ ...prev, onSale: e.target.checked }))} />
                    </label>
                    <label>Number of images:</label>
                    <select value={newProduct.imageCount}
                            onChange={e => setNewProduct(prev => ({ ...prev, imageCount: parseInt(e.target.value) }))}
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "8px", color: "white",
                                padding: "10px 14px", fontSize: "14px",
                                outline: "none", width: "100%",
                            }}
                    >
                        <option value={1}>1 photo</option>
                        <option value={4}>4 photos</option>
                    </select>
                    <h3>Attributes</h3>
                    {["size", "rarity", "quality", "manufacturer", "animatedCartoon"].map(attr => (
                        <input key={attr} type="text" placeholder={attr}
                               value={newProduct.attributes[attr]}
                               onChange={e => setNewProduct(prev => ({
                                   ...prev,
                                   attributes: { ...prev.attributes, [attr]: e.target.value }
                               }))}
                        />
                    ))}
                    <button onClick={handleCreateProduct} className={styles.createBtn}>
                        Create Product
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductsTab;