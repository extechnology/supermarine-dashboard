import getEnquiry from "@/api/getEnquiry";
import { useEffect, useState } from "react";
import type { Enquiry } from "../types";

const useEnquiry = () => {
  const [enquiry, setEnquiry] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEnquiry()
      .then((data) => {
        setEnquiry(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);
  return { enquiry, loading, error };
};


export default useEnquiry