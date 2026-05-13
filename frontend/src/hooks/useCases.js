import { useEffect, useState } from "react";
import api from "../services/api.js";

const useCases = (params = {}) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    const { data } = await api.get("/cases", { params });
    setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, [params.status, params.priority]);

  return { cases, loading, refetch: fetchCases };
};

export default useCases;
