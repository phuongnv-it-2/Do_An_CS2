import React from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { Leaf, Droplets, Wind, Sun } from "lucide-react";
import { Link } from "react-router-dom";

function Login() {
  const initialValues = { user: "", password: "" };

  const validationSchema = yup.object().shape({
    user: yup.string().required("Bạn phải nhập email hoặc username"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .required("Bạn phải nhập mật khẩu"),
  });

  const onSubmit = (data, { setSubmitting }) => {
    axios
      .post("https://do-an-cs2.onrender.com/user/login", data, {
        withCredentials: true,
      })
      .then((res) => {
        const { accessToken, user } = res.data;

        if (!accessToken) {
          throw new Error("Không nhận được token từ server");
        }

        // Lưu token + user
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        if (user?.redirect) {
          window.location.href = user.redirect;
        } else {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.error("❌ Đăng nhập thất bại:", err);
        console.error("❌ Response data:", err.response?.data);
        alert(err.response?.data?.message || "Email hoặc mật khẩu không đúng");
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

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#00ebc7] border-opacity-20">
          {/* Header with gradient */}
          <div className="relative px-8 pt-12 pb-8 bg-gradient-to-br from-[#00ebc7] to-[#00d4b5]">
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
            <div className="relative flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-[#fffffe]">
                <Leaf size={48} className="text-[#00ebc7]" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2 text-[#00214d]">
              Chào mừng trở lại
            </h2>
            <p className="text-center text-sm text-[#00214d] opacity-80">
              Đăng nhập để bảo vệ hành tinh xanh
            </p>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }) => (
              <Form className="px-8 py-8">
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-[#00214d]">
                    Tài khoản
                  </label>
                  <Field
                    type="text"
                    name="user"
                    placeholder="Nhập email hoặc username"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#00ebc7] focus:outline-none focus:ring-2 focus:ring-[#00ebc7] transition-all duration-300 text-[#1b2d45]"
                  />
                  <ErrorMessage
                    name="user"
                    component="div"
                    className="text-xs mt-1 text-[#ff5470]"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-[#00214d]">
                    Mật khẩu
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#00ebc7] focus:outline-none focus:ring-2 focus:ring-[#00ebc7] transition-all duration-300 text-[#1b2d45]"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-xs mt-1 text-[#ff5470]"
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-[#00ebc7]"
                    />
                    <span className="ml-2 text-sm text-[#1b2d45]">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-semibold text-[#00ebc7] hover:underline transition-all"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-[#00ebc7] text-[#00214d] transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                      Đang đăng nhập...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p> Chưa có tài khoản?</p>
                  <Link to={"/register"}>
                    <p className="font-semibold text-[#00ebc7] hover:underline transition-all">
                      Đăng ký ngay
                    </p>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="px-8 py-6 text-center bg-[#f0fffe]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf size={16} className="text-[#00ebc7]" />
              <p className="text-xs font-semibold text-[#1b2d45]">
                Cùng nhau bảo vệ môi trường
              </p>
              <Leaf size={16} className="text-[#00ebc7]" />
            </div>
            <p className="text-xs text-[#1b2d45] opacity-60">
              Mỗi hành động nhỏ đều tạo nên sự khác biệt lớn 🌍
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
