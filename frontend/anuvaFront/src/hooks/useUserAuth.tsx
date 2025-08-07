import { RootState } from "@/store/store";
import { useSelector } from "react-redux"


const useUserAuth = () => {
    const userAuth = useSelector((state: RootState) => state.auth.data);
    return userAuth;
}

export default useUserAuth;