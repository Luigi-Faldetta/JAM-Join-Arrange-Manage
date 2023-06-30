import { useState } from 'react';
import './ProfilePage.css';
const ProfilePage = (): any => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  
  return (
    <div className='profile-container'>
      <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex justify-end px-4 pt-4'></div>
        <div className='flex flex-col items-center pb-10'>
          <img
            className='w-24 h-25 mb-3 rounded-full shadow-lg'
            src='https://media.istockphoto.com/id/501778507/es/foto/divertidos-sonriendo-desagradable-maullar-mascota-peque%C3%B1os.jpg?s=2048x2048&w=is&k=20&c=o4nXxbpCGvGSw8i8-tGEkw2hKRBXUQDt8GCGmst--Sk='
            alt='user img'
          />
          <h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
            Profile User
          </h5>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Some info
          </span>
          <form className='edit-profile-form'>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              placeholder='Name'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='text'
              placeholder='Email'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              placeholder='Enter Password'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type='password'
              placeholder='Confirm Password'
              className='input input-bordered w-full max-w-xs'
            />
          </form>
          <div className='flex mt-4 space-x-3 md:mt-6'>
            <button
              type='submit'
              className='btn btn-info'
            >
              Save Changes
            </button>
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
