import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export const useAuth = async () => {
    // A qeury to the backend route that return if the user is logged in or not
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(()=>{
        if (!token) { 
            navigate('/')
        }
    }, [token, navigate]);
}