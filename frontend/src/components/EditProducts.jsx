import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X, Save, ArrowLeft } from "lucide-react";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    Name: "",
    Description: "",
    Price: "",
    ImgPath: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProduct(res.data);
        if (res.data.ImgPath) {
          setImagePreview(`http://localhost:3000/${res.data.ImgPath}`);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Không tìm thấy sản phẩm!");
        navigate("/");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File ảnh tối đa 5MB!");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("Name", product.Name);
      formData.append("Description", product.Description);
      formData.append("Price", product.Price);
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`http://localhost:3000/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Cập nhật sản phẩm thành công!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật sản phẩm!");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative">
      <div className="relative w-full max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại danh sách</span>
        </button>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sửa Sản Phẩm</h1>
          </div>

          <div className="space-y-6">
            {/* Upload ảnh */}
            <div className="group">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                {!imagePreview ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500">
                      Click để upload hoặc kéo thả
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Name */}
            <div className="group">
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="Name"
                value={product.Name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all outline-none"
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="Description"
                value={product.Description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all outline-none"
              />
            </div>

            {/* Price */}
            <div className="group">
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                name="Price"
                value={product.Price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 transition-all outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save className="w-5 h-5 inline-block mr-2" /> Lưu Thay Đổi
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="flex-1 bg-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
              >
                Hủy Bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
