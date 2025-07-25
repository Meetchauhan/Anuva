import { AuthContext } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

// export function useAuth() {
//   const { data: user, isLoading } = useQuery({
//     queryKey: ["http://localhost:5000/api/auth/user"],
//     retry: false,
//   });

//   return {
//     user:user?.user,
//     isLoading,
//     isAuthenticated: !!user,
//   };
// }




export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    ...context,
    isAuthenticated: !!context.user && context.isToken,
  };
}








export function useUserAuth(){
 const isToken = sessionStorage.getItem('token') ? true : false;
 return {
  isToken,
 }
}
