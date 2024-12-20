
import axios from 'axios';
import toast from 'react-hot-toast'

// Tạo một instance của axios với cấu hình cơ bản
const axiosInstance = axios.create({

  // baseURL: 'http://localhost:8080',
  baseURL: 'https://toptop-be.onrender.com/api/v1',
});

// Interceptor cho request để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response để xử lý lỗi 401 (token hết hạn)
axiosInstance.interceptors.response.use(
  (response) => response, // Nếu thành công, trả về response
  async (error) => {
    const originalRequest = error.config;

    // Nếu gặp lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã retry
      const refreshToken = localStorage.getItem('refreshToken'); // Lấy refreshToken từ localStorage

      // Kiểm tra nếu không có refreshToken, buộc người dùng đăng nhập lại
      if (!refreshToken) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token'); // Xóa token cũ
        localStorage.removeItem('refreshToken'); // Xóa refreshToken cũ
        window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
        return Promise.reject(error);
      }

      try {
        // Gửi yêu cầu refresh token đến API
        // const { data } = await axios.post('http://localhost:8080/auth/refresh-token', {
        const { data } = await axios.post('https://toptop-be.onrender.com/api/v1/auth/refresh-token', {
          refreshToken,
        });

        // Lưu accessToken mới vào localStorage
        const newAccessToken = data.access_token;
        localStorage.setItem('token', newAccessToken);

        // Cập nhật header Authorization với token mới
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Thực hiện lại yêu cầu ban đầu với token mới
        return axiosInstance(originalRequest);
      } catch (err) {
        // Nếu refresh token không hợp lệ hoặc đã hết hạn
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token'); // Xóa token cũ
        localStorage.removeItem('refreshToken'); // Xóa refreshToken cũ
        window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
        return Promise.reject(err);
      }
    }

    // Trả về lỗi nếu không phải lỗi 401 hoặc lỗi khác
    return Promise.reject(error);
  }
);

export default axiosInstance;
