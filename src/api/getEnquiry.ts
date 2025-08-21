import axiosInstance from "./axiosinstace";

const getEnquiry = async () => {
    try {
        const response = await axiosInstance.get("enquiry-bookings/");
        return response.data;
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        return [];
    }
};

export default getEnquiry