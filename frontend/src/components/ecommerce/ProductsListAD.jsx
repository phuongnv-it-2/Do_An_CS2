import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Printer,
  Download,
  Grid,
  List,
  Search,
} from "lucide-react";

const ProductsListAD = () => {
  const [mode, setMode] = useState("view");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);
  const API_URL = "http://localhost:3000";

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_URL}/${imgPath}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    if (mode === "view") {
      setSelectedProducts((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } else {
      setEditingProduct(products.find((p) => p.id === productId));
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const handlePrint = () => {
    const selected = products.filter((p) => selectedProducts.includes(p.id));
    console.log("Printing:", selected);
    alert(`Đang in ${selected.length} sản phẩm`);
  };

  const handleExport = () => {
    const selected = products.filter((p) => selectedProducts.includes(p.id));
    console.log("Exporting:", selected);
    alert(`Đang xuất ${selected.length} sản phẩm`);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("Name", editingProduct.Name);
      formData.append("Description", editingProduct.Description);
      formData.append("Price", editingProduct.Price);

      // Nếu có file mới
      if (editingProduct.imageFile) {
        formData.append("image", editingProduct.imageFile);
      }

      // Nếu colors là mảng
      if (editingProduct.colors) {
        editingProduct.colors.forEach((color) => {
          formData.append("colors", color);
        });
      }

      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Lỗi khi cập nhật sản phẩm");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const token = localStorage.getItem("accesstoken");
      const response = await fetch(`/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
        alert("Xóa thành công!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ebc7]"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          editingProduct ? "mr-96" : ""
        }`}
      >
        {/* Header */}
        <div className="bg-[#fffffe] rounded-2xl border-2 border-[#00214d] p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-[#00214d]">
                Products Management
              </h2>
              <p className="text-sm text-[#1b2d45] mt-1">
                {mode === "view"
                  ? "View and select products"
                  : "Manage and edit products"}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#00214d] rounded-xl p-1.5">
              <button
                onClick={() => {
                  setMode("view");
                  setEditingProduct(null);
                  setSelectedProducts([]);
                }}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  mode === "view"
                    ? "bg-[#00ebc7] text-[#00214d] shadow-md"
                    : "text-[#fffffe] hover:bg-[#1b2d45]"
                }`}
              >
                <Eye className="w-4 h-4 inline-block mr-2" />
                View Mode
              </button>
              <button
                onClick={() => {
                  setMode("manage");
                  setSelectedProducts([]);
                }}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  mode === "manage"
                    ? "bg-[#00ebc7] text-[#00214d] shadow-md"
                    : "text-[#fffffe] hover:bg-[#1b2d45]"
                }`}
              >
                <Edit className="w-4 h-4 inline-block mr-2" />
                Manage Mode
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1b2d45]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#00214d] rounded-xl bg-[#fffffe] text-[#00214d] placeholder-[#1b2d45] focus:ring-2 focus:ring-[#00ebc7] focus:border-[#00ebc7] font-medium"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-[#00214d] rounded-xl p-1.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#00ebc7] text-[#00214d]"
                    : "text-[#fffffe] hover:bg-[#1b2d45]"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#00ebc7] text-[#00214d]"
                    : "text-[#fffffe] hover:bg-[#1b2d45]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            {mode === "view" && selectedProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#00214d] bg-[#fde24f] px-3 py-1.5 rounded-lg">
                  {selectedProducts.length} selected
                </span>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-[#00ebc7] text-[#00214d] rounded-xl hover:bg-[#00d4b4] transition-all font-bold shadow-md flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleExport}
                  className="px-5 py-2.5 bg-[#fde24f] text-[#00214d] rounded-xl hover:bg-[#fdd91f] transition-all font-bold shadow-md flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            )}
          </div>

          {/* Select All */}
          {mode === "view" && (
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 text-[#00ebc7] border-2 border-[#00214d] rounded focus:ring-2 focus:ring-[#00ebc7]"
                />
                <span className="text-sm font-bold text-[#00214d] group-hover:text-[#00ebc7] transition-colors">
                  Select all products
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product.id)}
              className={`bg-[#fffffe] rounded-2xl border-3 transition-all cursor-pointer relative overflow-hidden ${
                mode === "view" && selectedProducts.includes(product.id)
                  ? "border-[#00ebc7] shadow-2xl scale-105 ring-4 ring-[#00ebc7]/30"
                  : mode === "manage" && editingProduct?.id === product.id
                  ? "border-[#fde24f] shadow-2xl scale-105 ring-4 ring-[#fde24f]/30"
                  : "border-[#00214d] hover:border-[#00ebc7] hover:shadow-xl"
              }`}
              style={{ borderWidth: "2px" }}
            >
              {mode === "view" && (
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectProduct(product.id);
                    }}
                    className="w-6 h-6 text-[#00ebc7] border-2 border-[#00214d] rounded focus:ring-2 focus:ring-[#00ebc7]"
                  />
                </div>
              )}

              <div className={viewMode === "grid" ? "p-5" : "flex gap-4 p-5"}>
                <div className="relative">
                  <img
                    src={getImageUrl(product.ImgPath)}
                    alt={product.Name}
                    className={`${
                      viewMode === "grid"
                        ? "w-full h-52 object-cover rounded-xl mb-4"
                        : "w-28 h-28 object-cover rounded-xl"
                    } border-2 border-[#00214d]`}
                  />

                  {mode === "manage" && (
                    <div className="absolute top-2 right-2 bg-[#ff5470] text-white p-2 rounded-lg shadow-lg">
                      <Edit className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-xl text-[#00214d] mb-2 leading-tight">
                    {product.Name}
                  </h3>
                  <p className="text-sm text-[#1b2d45] mb-3 line-clamp-2">
                    {product.Description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#00ebc7]">
                      ${parseFloat(product.Price).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 bg-[#fde24f] px-3 py-1.5 rounded-lg">
                      <span className="text-[#ff5470] text-lg">★</span>
                      <span className="text-sm font-bold text-[#00214d]">
                        {product.rating || "0.0"} ({product.reviewCount || 0})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-[#fffffe] rounded-2xl border-2 border-[#00214d]">
            <p className="text-xl font-bold text-[#1b2d45]">
              No products found
            </p>
            <p className="text-sm text-[#1b2d45] mt-2">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>

      {/* Edit Sidebar */}
      {editingProduct && mode === "manage" && (
        <div className="fixed right-0 top-0 h-full w-96 bg-[#fffffe] border-l-4 border-[#00214d] shadow-2xl overflow-y-auto z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#00214d]">
              <h3 className="text-2xl font-bold text-[#00214d]">
                Edit Product
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 bg-[#ff5470] hover:bg-[#ff3d5e] text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#00214d] mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.Name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      Name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-[#00214d] rounded-xl bg-[#fffffe] text-[#00214d] font-medium focus:ring-2 focus:ring-[#00ebc7] focus:border-[#00ebc7]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00214d] mb-2">
                  Description
                </label>
                <textarea
                  value={editingProduct.Description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      Description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-[#00214d] rounded-xl bg-[#fffffe] text-[#00214d] font-medium focus:ring-2 focus:ring-[#00ebc7] focus:border-[#00ebc7]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00214d] mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00ebc7] font-bold text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    value={editingProduct.Price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        Price: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#00214d] rounded-xl bg-[#fffffe] text-[#00214d] font-bold text-lg focus:ring-2 focus:ring-[#00ebc7] focus:border-[#00ebc7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00214d] mb-2">
                  Product Image
                </label>

                {/* Hiển thị ảnh hiện tại hoặc ảnh preview */}
                <img
                  src={
                    previewImg
                      ? previewImg
                      : getImageUrl(editingProduct?.ImgPath)
                  }
                  alt={editingProduct?.Name}
                  className="w-full h-56 object-cover rounded-xl border-2 border-[#00214d] mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm mt-2"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreviewImg(URL.createObjectURL(file));
                      setEditingProduct({
                        ...editingProduct,
                        imageFile: file,
                      });
                    }
                  }}
                />

                {previewImg && (
                  <img
                    src={previewImg}
                    alt="preview"
                    className="w-32 h-32 object-cover mt-3 rounded-lg border"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-5 py-4 bg-[#00ebc7] text-[#00214d] rounded-xl hover:bg-[#00d4b4] transition-all flex items-center justify-center gap-2 font-bold shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleDeleteProduct(editingProduct.id)}
                  className="px-5 py-4 bg-[#ff5470] text-white rounded-xl hover:bg-[#ff3d5e] transition-all shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsListAD;
