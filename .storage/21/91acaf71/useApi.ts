import { useState, useEffect, useCallback } from 'react';
import { api, Child, Educator, Course, Payment, PreRegistration } from '@/lib/api';

// Generic hook for API operations
export function useApiData<T>(
  fetchFn: () => Promise<T[]>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
}

// Specific hooks for each entity
export function useChildren() {
  const { data, loading, error, refetch, setData } = useApiData(api.children.getAll);

  const createChild = async (child: Omit<Child, 'id'>) => {
    try {
      const newChild = await api.children.create(child);
      setData(prev => [...prev, newChild]);
      return newChild;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const updateChild = async (id: string, updates: Partial<Child>) => {
    try {
      const updatedChild = await api.children.update(id, updates);
      setData(prev => prev.map(child => child.id === id ? updatedChild : child));
      return updatedChild;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const deleteChild = async (id: string) => {
    try {
      await api.children.delete(id);
      setData(prev => prev.filter(child => child.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  return {
    children: data,
    loading,
    error,
    refetch,
    createChild,
    updateChild,
    deleteChild
  };
}

export function useEducators() {
  const { data, loading, error, refetch, setData } = useApiData(api.educators.getAll);

  const createEducator = async (educator: Omit<Educator, 'id'>) => {
    try {
      const newEducator = await api.educators.create(educator);
      setData(prev => [...prev, newEducator]);
      return newEducator;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const updateEducator = async (id: string, updates: Partial<Educator>) => {
    try {
      const updatedEducator = await api.educators.update(id, updates);
      setData(prev => prev.map(educator => educator.id === id ? updatedEducator : educator));
      return updatedEducator;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const deleteEducator = async (id: string) => {
    try {
      await api.educators.delete(id);
      setData(prev => prev.filter(educator => educator.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  return {
    educators: data,
    loading,
    error,
    refetch,
    createEducator,
    updateEducator,
    deleteEducator
  };
}

export function useCourses() {
  const { data, loading, error, refetch, setData } = useApiData(api.courses.getAll);

  const createCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const newCourse = await api.courses.create(course);
      setData(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      const updatedCourse = await api.courses.update(id, updates);
      setData(prev => prev.map(course => course.id === id ? updatedCourse : course));
      return updatedCourse;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await api.courses.delete(id);
      setData(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  return {
    courses: data,
    loading,
    error,
    refetch,
    createCourse,
    updateCourse,
    deleteCourse
  };
}

export function usePayments() {
  const { data, loading, error, refetch, setData } = useApiData(api.payments.getAll);

  const createPayment = async (payment: Omit<Payment, 'id'>) => {
    try {
      const newPayment = await api.payments.create(payment);
      setData(prev => [...prev, newPayment]);
      return newPayment;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const updatedPayment = await api.payments.update(id, updates);
      setData(prev => prev.map(payment => payment.id === id ? updatedPayment : payment));
      return updatedPayment;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  return {
    payments: data,
    loading,
    error,
    refetch,
    createPayment,
    updatePayment
  };
}

export function usePreRegistrations() {
  const { data, loading, error, refetch, setData } = useApiData(api.preRegistrations.getAll);

  const createPreRegistration = async (preReg: Omit<PreRegistration, 'id' | 'submittedAt'>) => {
    try {
      const newPreReg = await api.preRegistrations.create(preReg);
      setData(prev => [...prev, newPreReg]);
      return newPreReg;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la pré-inscription');
    }
  };

  const updatePreRegistration = async (id: string, updates: Partial<PreRegistration>) => {
    try {
      const updatedPreReg = await api.preRegistrations.update(id, updates);
      setData(prev => prev.map(preReg => preReg.id === id ? updatedPreReg : preReg));
      return updatedPreReg;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  return {
    preRegistrations: data,
    loading,
    error,
    refetch,
    createPreRegistration,
    updatePreRegistration
  };
}