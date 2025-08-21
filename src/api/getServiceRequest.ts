import axiosInstance from "./axiosinstace";

const getServiceRequest = async () => {
  try {
    const response = await axiosInstance.get("/service/enquiry/");
    return response.data;
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return [];
  }
};

export default getServiceRequest;
