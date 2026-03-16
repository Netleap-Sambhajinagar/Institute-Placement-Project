import client from "./client.js";

export const getPlacedStudents = async () => {
  try {
    const response = await client.get("/placed-students");
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching placed students", error);
    return [];
  }
};
