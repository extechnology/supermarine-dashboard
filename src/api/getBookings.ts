import axiosInstance from "./axiosinstace";

export const getBookings = async () => {
  const response = await axiosInstance.get("bookings/");
  return response.data;
};
