import client from "./client.js";

const emitInternshipsUpdated = () => {
  window.dispatchEvent(new Event(getInternshipsUpdatedEventName()));
};

export const getInternships = async () => {
  try {
    const response = await client.get("/internships");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to get internships", error);
    return [];
  }
};

export const saveInternships = async (internships) => {
  // Optional implementation if batch saving is needed, skipping for REST normally
};

export const addInternship = async (internshipInput) => {
  await client.post("/internships", internshipInput);
  emitInternshipsUpdated();
  return await getInternships();
};

export const updateInternship = async (id, internshipInput) => {
  await client.put(`/internships/${id}`, internshipInput);
  emitInternshipsUpdated();
  return await getInternships();
};

export const deleteInternship = async (id) => {
  await client.delete(`/internships/${id}`);
  emitInternshipsUpdated();
  return await getInternships();
};

export const getInternshipsUpdatedEventName = () => "internships-updated";
