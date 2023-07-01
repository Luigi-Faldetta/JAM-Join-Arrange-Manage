import { useState } from 'react';
import './ProfilePage.css';
import { useGetUserQuery } from '../../services/ThesisDB';
import { UserState } from '../../reduxFiles/slices/users';
import { useAuth } from '../../utils/useAuth';

const ProfilePage = (): any => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const uid = localStorage.getItem('token');
  useAuth()
  //@ts-ignore
  const { data } = useGetUserQuery(uid);
  //@ts-ignore
  console.log('data: ', data);

  const handleSubmitChanges = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.error('Password do not match');
    } else {
      try {
        const userFormData: Partial<UserState> &
          Pick<UserState, 'id' | 'name' | 'email' | 'password'> = {
          id: data?.data.id,
          name: event.currentTarget.username.value,
          email: event.currentTarget.email.value,
          password: event.currentTarget.password.value,
        };
        console.log(userFormData);
      } catch (error) {
        console.error('Error: ', error);
      }
    }
  };

  return (
    <div className='profile-container'>
      <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex justify-end px-4 pt-4'></div>
        <div className='flex flex-col items-center pb-10'>
          <img
            className='w-24 h-25 mb-3 rounded-full shadow-lg'
            src={data?.data.profilePic}
            alt='user img'
          />
          <h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
            {data?.data.name}
          </h5>
          <form
            className='edit-profile-form'
            onSubmit={handleSubmitChanges}
          >
            <input
              type='file'
              className='file-input file-input-bordered w-full max-w-xs'
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              name='username'
              placeholder='Name'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='text'
              name='email'
              placeholder='Email'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              name='password'
              placeholder='Enter Password'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type='password'
              name='confirmpassword'
              placeholder='Confirm Password'
              className='input input-bordered w-full max-w-xs'
            />
            <button
              type='submit'
              className='btn btn-info'
            >
              Save Changes
            </button>
          </form>
          <div className='flex mt-4 space-x-3 md:mt-6'>
            <button
              type='submit'
              className='btn btn-error'
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
