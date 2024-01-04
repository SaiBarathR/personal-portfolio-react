
import { useNavigate } from 'react-router-dom';
export default function UnknownRoute() {
    const navigate = useNavigate();
    navigate("/home");
}
