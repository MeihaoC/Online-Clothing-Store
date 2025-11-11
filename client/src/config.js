// API Configuration
// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5002/api";

const config = {
  API_BASE_URL,
};

export default config;

