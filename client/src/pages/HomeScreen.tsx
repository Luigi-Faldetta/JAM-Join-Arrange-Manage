import CreateUserForm from '../Components/UserDashboard/CreateUserForm';
import UserDashboardPage from '../Components/UserDashboard/UserDashboardPage';

const HomeScreen = () => {
  return (
    <>
      <UserDashboardPage></UserDashboardPage>
      <CreateUserForm></CreateUserForm>
    </>
  );
};

export default HomeScreen;
