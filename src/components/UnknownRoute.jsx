
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function UnknownRoute() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/home');
    }, [navigate]);
}
