import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const usePatient = () => {
    const { patients, loading, error } = useSelector((state: RootState) => state.patient);
    return { patients, loading, error };
};