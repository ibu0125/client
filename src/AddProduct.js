import React, { useEffect, useState } from "react";

const AddProduct = () => {
  const [product, setProduct] = useState({ name: "", price: "" });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5227/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Product added:", data);
        alert("Product added successfully!");
        fetchProducts(); // 商品を追加した後にリストを再取得
      } else {
        console.error("Error adding product:", response.statusText);
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5227/api/products/get");
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // 商品リストを状態にセット
      } else {
        console.error("Error fetching products:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product); // 編集する商品を設定
    setProduct({ name: product.name, price: product.price }); // フォームに値をセット
  };

  const handleUpdataProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const { id } = editingProduct;
    try {
      const response = await fetch(
        `http://localhost:5227/api/products/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        const data = await response.json(); // ここでデータを取得
        console.log("Product updated:", data);
        alert("Product updated successfully!");
        setEditingProduct(null); // 編集モードを解除
        fetchProducts();
      } else {
        const errorText = await response.text(); // エラーテキストを取得
        console.error(
          "Error updating product:",
          response.statusText,
          errorText
        );
        alert("Failed to update product: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred: " + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("本当に削除しますか？")) {
      // 確認ダイアログ
      try {
        const response = await fetch(
          `http://localhost:5227/api/products/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Product deleted:", data);
          alert("Product deleted successfully!");
          fetchProducts(); // 商品を再取得
        } else {
          const errorData = await response.json();
          console.error("Error deleting product:", response.statusText);
          console.error("Error deleting product:", errorData.error);
          alert("削除に失敗");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <form onSubmit={editingProduct ? handleUpdataProduct : handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name} // プロパティ名を修正
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price" // プロパティ名を修正
          value={product.price}
          onChange={handleChange}
          placeholder="Product Price"
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <h2>Products List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {" "}
            {/* idがユニークであることを確認 */}
            {product.name} - ${product.price}
            <button onClick={() => handleEditProduct(product)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddProduct;
