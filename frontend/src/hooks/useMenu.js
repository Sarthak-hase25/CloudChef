import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { menuService } from '../services/api';

export const MENU_QUERY_KEY = ['menu'];

export function useMenuQuery() {
  return useQuery({
    queryKey: MENU_QUERY_KEY,
    queryFn: async () => {
      const { data } = await menuService.getAll();
      return data;
    },
    // Keep data fresh, rely on SSE for invalidation
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddMenuItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem) => {
      const { data } = await menuService.create(newItem);
      return data;
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: MENU_QUERY_KEY });
      const previousData = queryClient.getQueryData(MENU_QUERY_KEY);

      queryClient.setQueryData(MENU_QUERY_KEY, (old) => {
        if (!old) return old;
        const optimisticId = `temp-${Date.now()}`;
        
        // Find or mock category
        let category = old.categories.find(c => c.name === newItem.categoryName);
        if (!category) {
          category = { id: `temp-cat-${Date.now()}`, name: newItem.categoryName };
        }

        const optimisticItem = { 
          ...newItem, 
          id: optimisticId, 
          category, 
          categoryId: category.id,
          isAvailable: true,
          price: parseFloat(newItem.price),
          prepTimeMinutes: parseInt(newItem.prepTimeMinutes) || 15
        };

        return {
          ...old,
          items: [...old.items, optimisticItem]
        };
      });

      return { previousData };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(MENU_QUERY_KEY, context.previousData);
      
      // Handle known 409 Duplicate Error
      if (err.response?.status === 409) {
        toast.error(err.response.data.error || 'Menu item already exists');
      } else {
        toast.error('Failed to add menu item');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEY });
    },
  });
}

export function useUpdateMenuItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await menuService.update(id, data);
      return res.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: MENU_QUERY_KEY });
      const previousData = queryClient.getQueryData(MENU_QUERY_KEY);

      queryClient.setQueryData(MENU_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) => 
            item.id === id ? { ...item, ...data, price: data.price ? parseFloat(data.price) : item.price } : item
          )
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(MENU_QUERY_KEY, context.previousData);
      toast.error('Failed to update menu item');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEY });
    },
  });
}

export function useDeleteMenuItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await menuService.delete(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: MENU_QUERY_KEY });
      const previousData = queryClient.getQueryData(MENU_QUERY_KEY);

      queryClient.setQueryData(MENU_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item.id !== id)
        };
      });

      return { previousData };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(MENU_QUERY_KEY, context.previousData);
      toast.error('Failed to delete menu item');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEY });
    },
  });
}

export function useRestoreMenuItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await menuService.restore(id);
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: MENU_QUERY_KEY });
      return { previousData: queryClient.getQueryData(MENU_QUERY_KEY) };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(MENU_QUERY_KEY, context.previousData);
      }
      toast.error('Failed to restore menu item');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEY });
    },
  });
}
