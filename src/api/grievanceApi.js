// // src/api/grievanceApi.js
// const API_URL = "https://your-api-url.com/api/grievances";  // Replace with actual API URL

// const getGrievances = async () => {
//   const response = await fetch(API_URL);
//   if (!response.ok) {
//     throw new Error("Error fetching grievances");
//   }
//   return response.json();
// };

// const getGrievanceDetails = async (id) => {
//   const response = await fetch(`${API_URL}/${id}`);
//   if (!response.ok) {
//     throw new Error("Error fetching grievance details");
//   }
//   return response.json();
// };

// export default {
//   getGrievances,
//   getGrievanceDetails,
// };


// src/api/grievanceApi.js

// export const loadGrievances = () => {
//   return JSON.parse(localStorage.getItem('grievances')) || [];
// };

// export const saveGrievances = (grievances) => {
//   localStorage.setItem('grievances', JSON.stringify(grievances));
// };

import axios from "axios";

const API_URL = "http://localhost:5000/api/grievances"; // Backend URL

export const loadGrievances = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error loading grievances:", error);
    throw error;
  }
};

export const saveGrievance = async (grievance) => {
  try {
    const response = await axios.post(API_URL, grievance);
    return response.data;
  } catch (error) {
    console.error("Error saving grievance:", error);
    throw error;
  }
};

export const updateGrievance = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating grievance:", error);
    throw error;
  }
};

export const deleteGrievance = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting grievance:", error);
    throw error;
  }
};
