import { useNavigate } from "react-router-dom";
const LoginScreen = () => {
  const navigate = useNavigate();

  const handleClick = (e:any) => {
    e.preventDefault();
    navigate('/');
  }
  return (
    <>
      <h1>Login Screen</h1>
      <button type="button" onClick={handleClick}>Back Home</button>
    </>
  )
};

export default LoginScreen;
