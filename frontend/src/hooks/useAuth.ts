import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["http://localhost:5000/api/auth/user"],
    retry: false,
    
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
