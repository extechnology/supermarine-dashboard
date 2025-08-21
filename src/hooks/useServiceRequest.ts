import getServiceRequest from "../api/getServiceRequest";
import { useEffect, useState } from "react";
import type { ServiceRequest } from "../types";

const useServiceRequest = () => {
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getServiceRequest()
      .then((data) => {
        setServiceRequest(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);
  return { serviceRequest, loading, error };
};


export default useServiceRequest;