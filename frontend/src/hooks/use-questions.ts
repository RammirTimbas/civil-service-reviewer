import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { Question } from '@/types/question';

export function useQuestions(category?: string, difficulty?: string) {
  return useQuery({
    queryKey: ['questions', category, difficulty],
    queryFn: async () => {
      const { data } = await api.get<Question[]>('/questions/', {
        params: { category, difficulty },
      });
      return data;
    },
  });
}

export function useMockExam() {
  return useQuery({
    queryKey: ['mock-exam'],
    queryFn: async () => {
      const { data } = await api.get<Question[]>('/questions/mock');
      return data;
    },
    enabled: false, // Don't fetch automatically
  });
}
