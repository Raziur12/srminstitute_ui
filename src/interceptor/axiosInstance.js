import axios from "axios";

const baseURL = 'https://bpskillcrest.srmup.in/'

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://srminstitute-ui.vercel.app",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  },
  withCredentials: true,
  timeout: 10000, // Set a timeout for requests (optional)
  validateStatus: (status) => {
    // Accept all status codes, you can customize this if needed
    return status >= 200 && status < 500;
  }
}); 



// const redirectToLogin = () => {
//   // You may replace this with your own logic to redirect the user to the login page
//   window.location.href = '/login';
// };
// const email = "kritgyakumar92@gmail.com"
// const password = "tempuser@123"
// const loginData = {
//     "email": email,
//     "password": password
// }

// const getCourses = () => {
//   axiosInstance  
//     .post("login", loginData)
//     .then((res) => {
//         localStorage.setItem("access", res.data.data.access);
//         localStorage.setItem("refresh", res.data.data.refresh);
//     })
// }

// const token = localStorage.getItem("access");
// if(!token) {
//   getCourses()
// } else {
//   getCourses()
// }

// Add an interceptor for setting the Authorization header with the access token
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
)


export default axiosInstance;