import React, { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { Upload, X } from "lucide-react";

function CreateProducts() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const initialValues = {
    Name: "",
    Description: "",
    Price: "",
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }

      // Kiểm tra kích thước (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File ảnh không được vượt quá 5MB!");
        return;
      }

      setImageFile(file);

      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Tạo FormData để gửi cả file và dữ liệu
      const formData = new FormData();
      formData.append("Name", data.Name);
      formData.append("Description", data.Description);
      formData.append("Price", data.Price);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.post("http://localhost:3000/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product created:", res.data);
      alert("Tạo sản phẩm thành công!");

      // Reset form và ảnh
      resetForm();
      removeImage();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi server");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = yup.object().shape({
    Name: yup.string().min(5).max(50).required("Hãy nhập tên sản phẩm"),
    Description: yup
      .string()
      .min(50)
      .required("Mô tả phải có ít nhất 50 ký tự"),
    Price: yup
      .number()
      .positive("Giá phải lớn hơn 0")
      .required("Hãy nhập giá sản phẩm"),
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Tạo Sản Phẩm Mới
      </h2>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            {/* Upload Ảnh */}
            <div className="mb-4">
              <label className="font-medium text-gray-700 block mb-2">
                Hình ảnh sản phẩm:
              </label>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click để upload</span>{" "}
                      hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                    {imageFile?.name}
                  </div>
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="Name"
                className="font-medium text-gray-700 block mb-2"
              >
                Tên sản phẩm: <span className="text-red-500">*</span>
              </label>
              <Field
                id="Name"
                name="Name"
                placeholder="VD: Cốc cà phê gốm sứ"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              />
              <ErrorMessage
                name="Name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="Description"
                className="font-medium text-gray-700 block mb-2"
              >
                Mô tả: <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                id="Description"
                name="Description"
                placeholder="VD: Cốc cà phê làm thủ công từ gốm sứ cao cấp, thiết kế hiện đại, phù hợp cho mọi không gian..."
                rows="4"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none"
              />
              <ErrorMessage
                name="Description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="Price"
                className="font-medium text-gray-700 block mb-2"
              >
                Giá (VNĐ): <span className="text-red-500">*</span>
              </label>
              <Field
                type="number"
                id="Price"
                name="Price"
                placeholder="VD: 150000"
                step="0.01"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              />
              <ErrorMessage
                name="Price"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Sản Phẩm"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateProducts;
