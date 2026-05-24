import { useEffect, useState } from "react";
import api from "../services/api.js";

const useCases = (params = {}) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/cases", { params });
      setCases(data);
    } catch (err) {
      setCases([]);
      setError(
        err.response?.data?.message ||
          "Unable to load rescue cases right now. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [params.status, params.priority]);

  return { cases, loading, error, refetch: fetchCases };
};

export default useCases;
