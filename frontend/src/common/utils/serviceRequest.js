import axios from "axios";

const serviceRequest = async (options = {}) => {
  try {
    // Set default headers if not provided
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    // Merge default headers with provided headers, prioritizing user-provided headers
    const headers = {
      ...defaultHeaders,
      ...(options.headers || {}),
    };

    // Set default method if not provided
    const method = (options.method || "get").toLowerCase();

    // Prepare request options
    const requestOptions = {
      ...options,
      method,
      headers,
    };

    // Make the request
    const response = await axios.request(requestOptions);

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle network or request errors
    console.error("API Request Error Message:", error.message);

    console.error("API Request Error:", error);

    // Throw a custom error with details for the caller to handle
    throw new Error(
      error.response?.data?.message || error.message || "Request failed"
    );
  }
};

// Example usage
/*
const createFolder = async (data) => {
  try {
    const response = await serviceRequest({
      url: "/api/create-folder",
      method: "post",
      data: { name: "New Folder", description: "Test" },
    });
    console.log("Folder created:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const uploadFile = async (data) => {
  try {
    const response = await serviceRequest({
      url: "/api/upload-file",
      method: "post",
      data: formData, // Use FormData for file uploads
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("File uploaded:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
*/

export default serviceRequest;
