import { useNavigate } from "react-router-dom"
const RegisterScreen = () => {
  const navigate = useNavigate();

  const handleClick = (e:any) => {
    e.preventDefault();
    navigate('/');
  }
  return (
    <>
      <h1>Register Screen</h1>
      <button type="button" onClick={handleClick}>Back Home</button>
    </>
  )
}

export default RegisterScreen