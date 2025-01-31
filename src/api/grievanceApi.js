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

export const loadGrievances = () => {
  return JSON.parse(localStorage.getItem('grievances')) || [];
};

export const saveGrievances = (grievances) => {
  localStorage.setItem('grievances', JSON.stringify(grievances));
};
