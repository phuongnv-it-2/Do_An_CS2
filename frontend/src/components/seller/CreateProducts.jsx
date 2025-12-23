import React, { useState } from "react";
import axios from "axios";
import {
  Package,
  ShoppingCart,
  Star,
  Grid,
  List,
  Search,
  X,
  Save,
  ArrowLeft,
  Sparkles,
  ImagePlus,
  DollarSign,
  FileText,
  Upload,
} from "lucide-react";
import * as yup from "yup";
import NavBar_Seller from "./NavBar_Seller";

function CreateProducts() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mod3DFile, setMod3DFile] = useState(null);

  const styles = {
    colorBackground: "#fffffe",
    colorHeadline: "#00214d",
    colorParagraph: "#1b2d45",
    colorButton: "#00ebc7",
    colorButtonText: "#00214d",
    colorStroke: "#00214d",
    colorMain: "#fffffe",
    colorHighlight: "#00ebc7",
    colorSecondary: "#ff5470",
    colorTertiary: "#fde24f",
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
  const handleMod3DChange = (e) => {
    const file = e.target.files[0];
    if (file) setMod3DFile(file);
  };

  const removeMod3D = () => setMod3DFile(null);

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

  const onSubmit = async (data, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("Name", data.Name);
      formData.append("Description", data.Description);
      formData.append("Price", data.Price);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // ✅ Thêm mod3D file nếu có
      if (mod3DFile) {
        formData.append("mod3D", mod3DFile);
      }

      const res = await axios.post(
        "https://do-an-cs2.onrender.com/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Tạo sản phẩm thành công!");
      resetForm();
      removeImage();
      removeMod3D();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center p-6"
      style={{
        background: `linear-gradient(135deg, ${styles.colorBackground} 0%, ${styles.colorHighlight}15 100%)`,
      }}
    >
      <div className="relative w-full max-w-5xl h-[90vh]">
        <div
          className="h-full rounded-3xl shadow-2xl p-8 backdrop-blur-xl relative overflow-hidden flex flex-col"
          style={{
            backgroundColor: `${styles.colorMain}`,
            border: `3px solid ${styles.colorHighlight}`,
            boxShadow: `0 25px 50px -12px ${styles.colorHighlight}40`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between mb-6 pb-4"
            style={{ borderBottom: `2px solid ${styles.colorHighlight}30` }}
          >
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
              style={{
                backgroundColor: `${styles.colorHighlight}20`,
                color: styles.colorHeadline,
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Quay lại</span>
            </button>

            <div className="flex items-center gap-2">
              <Sparkles
                className="w-6 h-6"
                style={{ color: styles.colorHighlight }}
              />
              <h1
                className="text-3xl font-black"
                style={{ color: styles.colorHeadline }}
              >
                Tạo Sản Phẩm
              </h1>
              <Sparkles
                className="w-6 h-6"
                style={{ color: styles.colorTertiary }}
              />
            </div>

            <div className="w-24"></div>
          </div>

          {/* FORM */}
          <Formik
            initialValues={{ Name: "", Description: "", Price: "" }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }) => (
              <Form className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-6">
                  {/* Cột trái: Hình ảnh + mod3D */}
                  <div className="space-y-6">
                    {/* Upload ảnh */}
                    <div>
                      <label
                        className="flex items-center gap-2 font-bold mb-3 text-lg"
                        style={{ color: styles.colorHeadline }}
                      >
                        <ImagePlus
                          className="w-5 h-5"
                          style={{ color: styles.colorHighlight }}
                        />
                        Hình ảnh sản phẩm
                      </label>

                      {!imagePreview ? (
                        <label
                          className="relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
                          style={{
                            borderColor: styles.colorHighlight,
                            backgroundColor: `${styles.colorHighlight}05`,
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className="p-4 rounded-full mb-4"
                              style={{
                                backgroundColor: `${styles.colorHighlight}20`,
                              }}
                            >
                              <Upload
                                className="w-12 h-12"
                                style={{ color: styles.colorHighlight }}
                              />
                            </div>
                            <p
                              className="mb-2 text-lg font-bold"
                              style={{ color: styles.colorHeadline }}
                            >
                              Kéo thả ảnh vào đây
                            </p>
                            <p
                              className="text-sm px-4 py-1 rounded-full"
                              style={{
                                color: styles.colorParagraph,
                                backgroundColor: `${styles.colorTertiary}30`,
                              }}
                            >
                              hoặc click để chọn
                            </p>
                            <p
                              className="text-xs mt-2"
                              style={{
                                color: styles.colorParagraph,
                                opacity: 0.6,
                              }}
                            >
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
                        <div
                          className="relative rounded-2xl overflow-hidden group h-96"
                          style={{
                            border: `2px solid ${styles.colorHighlight}`,
                          }}
                        >
                          <img
                            src={imagePreview}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-3 right-3 p-2 rounded-xl transition-all hover:scale-110 hover:rotate-90"
                            style={{
                              backgroundColor: styles.colorSecondary,
                              color: styles.colorMain,
                            }}
                          >
                            <X className="w-5 h-5" />
                          </button>

                          {imageFile && (
                            <div
                              className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl text-sm font-bold"
                              style={{
                                backgroundColor: `${styles.colorHeadline}95`,
                                color: styles.colorMain,
                              }}
                            >
                              📷 {imageFile.name}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Upload mod3D */}
                    <div>
                      <label
                        className="flex items-center gap-2 font-bold mb-3 text-lg"
                        style={{ color: styles.colorHeadline }}
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: styles.colorHighlight }}
                        />
                        File 3D / mod3D
                      </label>

                      {!mod3DFile ? (
                        <label
                          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
                          style={{
                            borderColor: styles.colorHighlight,
                            backgroundColor: `${styles.colorHighlight}05`,
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className="p-4 rounded-full mb-4"
                              style={{
                                backgroundColor: `${styles.colorHighlight}20`,
                              }}
                            >
                              <Upload
                                className="w-12 h-12"
                                style={{ color: styles.colorHighlight }}
                              />
                            </div>
                            <p
                              className="mb-2 text-lg font-bold"
                              style={{ color: styles.colorHeadline }}
                            >
                              Kéo thả file vào đây
                            </p>
                            <p
                              className="text-sm px-4 py-1 rounded-full"
                              style={{
                                color: styles.colorParagraph,
                                backgroundColor: `${styles.colorTertiary}30`,
                              }}
                            >
                              hoặc click để chọn
                            </p>
                            <p
                              className="text-xs mt-2"
                              style={{
                                color: styles.colorParagraph,
                                opacity: 0.6,
                              }}
                            >
                              .glb, .gltf, .obj, .fbx (MAX 50MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".glb,.gltf,.obj,.fbx"
                            onChange={handleMod3DChange}
                          />
                        </label>
                      ) : (
                        <div
                          className="relative rounded-2xl overflow-hidden group h-48 flex items-center justify-center"
                          style={{
                            border: `2px solid ${styles.colorHighlight}`,
                          }}
                        >
                          <div
                            className="text-center font-medium text-base"
                            style={{ color: styles.colorHeadline }}
                          >
                            📁 {mod3DFile.name}
                          </div>

                          <button
                            type="button"
                            onClick={removeMod3D}
                            className="absolute top-3 right-3 p-2 rounded-xl transition-all hover:scale-110 hover:rotate-90"
                            style={{
                              backgroundColor: styles.colorSecondary,
                              color: styles.colorMain,
                            }}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cột phải: Name, Description, Price */}
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label
                        className="flex items-center gap-2 font-bold mb-2 text-lg"
                        style={{ color: styles.colorHeadline }}
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: styles.colorHighlight }}
                        />
                        Tên sản phẩm{" "}
                        <span style={{ color: styles.colorSecondary }}>*</span>
                      </label>
                      <Field
                        name="Name"
                        placeholder="VD: Túi vải canvas tái chế"
                        className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none"
                        style={{
                          border: `2px solid ${styles.colorHighlight}40`,
                          color: styles.colorHeadline,
                          backgroundColor: styles.colorBackground,
                        }}
                      />
                      <ErrorMessage
                        name="Name"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className="flex items-center gap-2 font-bold mb-2 text-lg"
                        style={{ color: styles.colorHeadline }}
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: styles.colorTertiary }}
                        />
                        Mô tả{" "}
                        <span style={{ color: styles.colorSecondary }}>*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="Description"
                        rows="8"
                        placeholder="Mô tả chi tiết sản phẩm..."
                        className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none resize-none"
                        style={{
                          border: `2px solid ${styles.colorTertiary}40`,
                          color: styles.colorHeadline,
                          backgroundColor: styles.colorBackground,
                        }}
                      />
                      <ErrorMessage
                        name="Description"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label
                        className="flex items-center gap-2 font-bold mb-2 text-lg"
                        style={{ color: styles.colorHeadline }}
                      >
                        <DollarSign
                          className="w-5 h-5"
                          style={{ color: styles.colorSecondary }}
                        />
                        Giá bán (VNĐ){" "}
                        <span style={{ color: styles.colorSecondary }}>*</span>
                      </label>
                      <Field
                        name="Price"
                        type="number"
                        step="1000"
                        placeholder="150000"
                        className="w-full px-4 py-3 rounded-xl text-base font-bold outline-none"
                        style={{
                          border: `2px solid ${styles.colorSecondary}40`,
                          color: styles.colorHeadline,
                          backgroundColor: styles.colorBackground,
                        }}
                      />
                      <ErrorMessage
                        name="Price"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Nút submit/reset */}
                <div
                  className="flex gap-4 pt-6 mt-6"
                  style={{ borderTop: `2px solid ${styles.colorHighlight}30` }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 font-bold py-4 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                    style={{
                      backgroundColor: styles.colorButton,
                      color: styles.colorButtonText,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="w-5 h-5 border-3 border-t-transparent rounded-full animate-spin"
                          style={{ borderColor: styles.colorButtonText }}
                        ></div>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Tạo sản phẩm</span>
                      </>
                    )}
                  </button>

                  <button
                    type="reset"
                    onClick={() => {
                      removeImage();
                      removeMod3D();
                    }}
                    className="flex-1 font-bold py-4 px-6 rounded-xl shadow-lg text-lg"
                    style={{
                      backgroundColor: styles.colorSecondary,
                      color: styles.colorMain,
                    }}
                  >
                    Reset
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CreateProducts;
