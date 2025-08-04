import { RootState } from "@/store/store";
import { useSelector } from "react-redux"

interface UserAuthData {
  token?: string;
  user?: any;
  [key: string]: any;
}

const useUserAuth = () => {
    const userAuth = useSelector((state: RootState) => state.auth.data) as UserAuthData | null;
    return userAuth;
}

export default useUserAuth;