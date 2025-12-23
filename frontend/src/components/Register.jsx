import React from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import {
  Leaf,
  Droplets,
  Wind,
  Sun,
  UserPlus,
  Mail,
  Lock,
  User,
} from "lucide-react";

function Register() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Bạn phải nhập username"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Bạn phải nhập email"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .required("Bạn phải nhập mật khẩu"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
      .required("Bạn phải xác nhận mật khẩu"),
    role: yup.string().required("Vui lòng chọn loại tài khoản"),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .post("https://do-an-cs2.onrender.com/user/register", values)
      .then(() => {
        alert("🎉 Đăng ký thành công!");
        resetForm();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Lỗi đăng ký");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="h-screen w-screen fixed inset-0 flex items-center justify-center p-4 overflow-auto">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating Eco Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] animate-[float_6s_ease-in-out_infinite]">
          <Leaf size={80} className="text-emerald-300/40" />
        </div>
        <div
          className="absolute top-40 right-[15%] animate-[float_7s_ease-in-out_infinite]"
          style={{ animationDelay: "2s" }}
        >
          <Droplets size={70} className="text-cyan-300/40" />
        </div>
        <div
          className="absolute bottom-32 left-[20%] animate-[float_8s_ease-in-out_infinite]"
          style={{ animationDelay: "4s" }}
        >
          <Wind size={90} className="text-teal-300/40" />
        </div>
        <div
          className="absolute bottom-48 right-[25%] animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: "1s" }}
        >
          <Sun size={75} className="text-amber-300/40" />
        </div>
        <div
          className="absolute top-1/2 left-[5%] animate-[float_7s_ease-in-out_infinite]"
          style={{ animationDelay: "3s" }}
        >
          <Leaf size={60} className="text-green-300/40" />
        </div>
        <div
          className="absolute top-2/3 right-[8%] animate-[float_8s_ease-in-out_infinite]"
          style={{ animationDelay: "5s" }}
        >
          <Droplets size={65} className="text-blue-300/40" />
        </div>
      </div>

      {/* Mesh Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(16 185 129) 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Register Card */}
      <div className="w-full h-190 max-w-2xl relative z-10 my-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#00ebc7] border-opacity-20">
          {/* Header with gradient */}
          <div className="relative px-6 pt-10 pb-6 bg-gradient-to-br from-[#00ebc7] to-[#00d4b5]">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="flex gap-4 flex-wrap">
                <Leaf size={40} className="text-[#00214d] animate-pulse" />
                <Droplets
                  size={35}
                  className="text-[#00214d] animate-pulse delay-100"
                />
                <Wind
                  size={38}
                  className="text-[#00214d] animate-pulse delay-200"
                />
              </div>
            </div>
            <div className="relative flex items-center justify-center mb-3">
              <div className="p-3 rounded-full bg-[#fffffe]">
                <UserPlus size={40} className="text-[#00ebc7]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-[#00214d]">
              Tham gia cùng chúng tôi
            </h2>
            <p className="text-center text-xs text-[#00214d] opacity-80">
              Cùng nhau xây dựng một tương lai xanh bền vững
            </p>
          </div>
          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="px-6 py-6">
                {/* Username Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-2 text-[#00214d]">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-[#00ebc7]" />
                    </div>
                    <Field
                      type="text"
                      name="username"
                      placeholder="Nhập username"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 border-[#00ebc7] focus:outline-none focus:ring-2 focus:ring-[#00ebc7] transition-all duration-300 text-[#1b2d45]"
                    />
                  </div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-xs mt-1 text-[#ff5470]"
                  />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-2 text-[#00214d]">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-[#00ebc7]" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Nhập email"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 border-[#00ebc7] focus:outline-none focus:ring-2 focus:ring-[#00ebc7] transition-all duration-300 text-[#1b2d45]"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-xs mt-1 text-[#ff5470]"
                  />
                </div>
                {/* Password Fields in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-[#00214d]">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-[#00ebc7]" />
                      </div>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 border-[#00ebc7] focus:outline-none focus:ring-2 focus:ring-[#00ebc7] transition-all duration-300 text-[#1b2d45]"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-xs mt-1 text-[#ff5470]"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-[#00214d]">
                      Nhập lại mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-[#00ebc7]" />
                      </div>
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 border-[#00ebc7] focus:outline-none focus:ring-2 focus:ring-[#00ebc7] transition-all duration-300 text-[#1b2d45]"
                      />
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-xs mt-1 text-[#ff5470]"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold mb-2 text-[#00214d]">
                    Loại tài khoản
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Field name="role">
                      {({ field }) => (
                        <>
                          <label className="relative cursor-pointer">
                            <input
                              type="radio"
                              {...field}
                              value="CUSTOMER"
                              checked={field.value === "CUSTOMER"}
                              className="sr-only peer"
                            />
                            <div className="p-4 rounded-xl border-2 border-[#00ebc7] peer-checked:bg-[#00ebc7] peer-checked:border-[#00ebc7] transition-all duration-300 text-center">
                              <Leaf
                                size={32}
                                className="mx-auto mb-2 text-[#00214d]"
                              />
                              <p className="font-semibold text-[#00214d]">
                                Khách hàng
                              </p>
                              <p className="text-xs text-[#1b2d45] mt-1">
                                Mua sắm xanh
                              </p>
                            </div>
                          </label>

                          <label className="relative cursor-pointer">
                            <input
                              type="radio"
                              {...field}
                              value="SELLER"
                              checked={field.value === "SELLER"}
                              className="sr-only peer"
                            />
                            <div className="p-4 rounded-xl border-2 border-[#00ebc7] peer-checked:bg-[#00ebc7] peer-checked:border-[#00ebc7] transition-all duration-300 text-center">
                              <Droplets
                                size={32}
                                className="mx-auto mb-2 text-[#00214d]"
                              />
                              <p className="font-semibold text-[#00214d]">
                                Người bán
                              </p>
                              <p className="text-xs text-[#1b2d45] mt-1">
                                Bán hàng xanh
                              </p>
                            </div>
                          </label>
                        </>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-xs mt-1 text-[#ff5470]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-base bg-[#00ebc7] text-[#00214d] transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang đăng ký...
                    </span>
                  ) : (
                    "Đăng ký"
                  )}
                </button>

                <div className="mt-5 text-center">
                  <p> Đã có tài khoản?</p>
                  <Link to="/login">
                    <p className="font-semibold text-[#00ebc7] hover:underline transition-all">
                      Đăng nhập ngay
                    </p>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="px-6 py-5 text-center bg-[#f0fffe]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf size={16} className="text-[#00ebc7]" />
              <p className="text-xs font-semibold text-[#1b2d45]">
                Bước đầu tiên cho hành tinh xanh
              </p>
              <Leaf size={16} className="text-[#00ebc7]" />
            </div>
            <p className="text-xs text-[#1b2d45] opacity-60">
              Mỗi thành viên mới là một hy vọng cho môi trường 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
