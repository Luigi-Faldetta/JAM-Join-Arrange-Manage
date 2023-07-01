import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reduxFiles/store";

export const useIsLoggedIn = () => {
    const logoutModal = useSelector((state: RootState) => state.logoutReducer.valueOf())
    const [isLoggedIn, setIsloggedIn] = useState(false)
    // Should be a call to the backend!!
    let token = localStorage.getItem('token');
    
    useEffect(() => {
        token = localStorage.getItem("token")
        setIsloggedIn(!!token)
        console.log(token);
    }, [token, logoutModal])



    return isLoggedIn;
}