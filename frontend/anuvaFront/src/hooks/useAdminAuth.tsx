import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useAdminAuth = () => {
    try {
        const adminAuth = useSelector((state: RootState) => state.adminAuth.data);
        return adminAuth;
    } catch (error) {
        console.error("useAdminAuth error:", error);
        return null;
    }
}

export default useAdminAuth;