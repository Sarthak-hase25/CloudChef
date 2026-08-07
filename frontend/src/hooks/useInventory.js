import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inventoryService } from '../services/api';

const QUERY_KEY = ['inventory'];

export function useInventoryQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await inventoryService.getAll();
      return data;
    },
    // Keep data fresh, rely on SSE for invalidation
    staleTime: 5 * 60 * 1000, 
  });
}

export function useAddIngredientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newIngredient) => {
      const { data } = await inventoryService.create(newIngredient);
      return data;
    },
    onMutate: async (newIngredient) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      // Snapshot previous value
      const previousInventory = queryClient.getQueryData(QUERY_KEY);

      // Optimistically update to the new value
      queryClient.setQueryData(QUERY_KEY, (old) => {
        const optimisticId = `temp-${Date.now()}`;
        return [...(old || []), { ...newIngredient, id: optimisticId }];
      });

      return { previousInventory };
    },
    onError: (err, newIngredient, context) => {
      // Rollback on error
      queryClient.setQueryData(QUERY_KEY, context.previousInventory);
      toast.error('Failed to add ingredient');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync with server
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateIngredientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await inventoryService.update(id, data);
      return res.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousInventory = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, (old) => {
        return (old || []).map((item) => (item.id === id ? { ...item, ...data } : item));
      });

      return { previousInventory };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(QUERY_KEY, context.previousInventory);
      toast.error('Failed to update ingredient');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteIngredientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await inventoryService.delete(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousInventory = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, (old) => {
        return (old || []).filter((item) => item.id !== id);
      });

      return { previousInventory };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(QUERY_KEY, context.previousInventory);
      toast.error('Failed to delete ingredient');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useAddStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }) => {
      const res = await inventoryService.addStock(id, { quantity });
      return res.data;
    },
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousInventory = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, (old) => {
        return (old || []).map((item) => 
          item.id === id ? { ...item, currentStock: item.currentStock + parseFloat(quantity) } : item
        );
      });

      return { previousInventory };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(QUERY_KEY, context.previousInventory);
      toast.error('Failed to add stock');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useRestoreIngredientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await inventoryService.restore(id);
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      return { previousInventory: queryClient.getQueryData(QUERY_KEY) };
    },
    onError: (err, variables, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(QUERY_KEY, context.previousInventory);
      }
      toast.error('Failed to restore ingredient');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
