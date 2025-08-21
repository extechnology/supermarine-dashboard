import { useState, useEffect } from "react";
import { getBookings } from "../api/getBookings";
import type { Booking } from "../types";

interface UseBookingsResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const useBookings = (): UseBookingsResult => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
};

export default useBookings;
