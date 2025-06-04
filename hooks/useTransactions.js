"use client"

import { useState, useEffect } from 'react';

export const useTransactions = (filters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();

      const response = await fetch(`/api/transactions?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data);
        setPagination(data.pagination);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    pagination,
    refetch: fetchTransactions
  };
};