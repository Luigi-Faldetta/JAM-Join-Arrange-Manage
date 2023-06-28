import CreateUserForm from '../Components/UserDashboard/CreateUserForm';
import UserDashboardPage from '../Components/UserDashboard/UserDashboardPage';


const HomeScreen = () => {
  return (
    <div className='hero'>
      <UserDashboardPage></UserDashboardPage>
      <CreateUserForm></CreateUserForm>
    </div>
  );
};

export default HomeScreen;
