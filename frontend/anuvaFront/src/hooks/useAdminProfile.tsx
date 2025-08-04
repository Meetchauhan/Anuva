import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useAdminProfile = () => {
    const adminProfile = useSelector((state: RootState) => state.adminAuth.data);
    return adminProfile;
}

export default useAdminProfile;