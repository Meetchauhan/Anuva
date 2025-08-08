import { RootState } from "@/store/store";
import { useSelector } from "react-redux"


const useOtp = () => {
    const otp = useSelector((state: RootState) => state.auth.isOtpSent);
    return otp;
}

export default useOtp;