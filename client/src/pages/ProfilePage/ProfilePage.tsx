import { useState } from 'react';
import './ProfilePage.css';
import { useGetUserQuery } from '../../services/ThesisDB';
import { UserState } from '../../reduxFiles/slices/users';
import { useAuth } from '../../utils/useAuth';
import { useUpdateUserMutation } from '../../services/ThesisDB';
import Delete from '../../Components/Delete';

const ImageUploader = ({
  onImageSelect,
}: {
  onImageSelect: (file: File) => void;
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className='upload-btn mb-3'>
      <input
        id='profilePic'
        type='file'
        name='profilePic'
        accept='image/*'
        className="file-input-bordered file-input w-full max-w-xs"
        onChange={handleImageChange}
      />
    </div>
  );
};

const ProfilePage = (): any => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userPhoto, setUserPhoto] = useState<File | null | string>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [open, setOpen] = useState(false)

  const uid = localStorage.getItem('token');
  useAuth();
  //@ts-ignore
  const { data } = useGetUserQuery(uid);
  //@ts-ignore
  console.log('data===>> ', data);

  const [updateUser] = useUpdateUserMutation();

  const handleImageUpload = async () => {
    if (userPhoto) {
      const data = new FormData();
      data.append('file', userPhoto);
      data.append('upload_preset', 'tdzb6v4z');
      data.append('cloud_name', 'de4bu4ijj');

      try {
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/de4bu4ijj/image/upload',
          {
            method: 'post',
            body: data,
          }
        );

        const uploadedImage = await res.json();
        if (uploadedImage && uploadedImage.url) {
          console.log('Image from Cloudinary: ', uploadedImage);
          return uploadedImage;
        } else {
          console.log('Error uploading image');
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      return null;
    }
  };

  const handleSubmitChanges = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setUpdateStatus('');
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
    } else {
      const userFormData: Partial<UserState> & Pick<UserState, 'userId'> = {
        userId: data?.data.userId,
      };

      if (name) {
        userFormData.name = name;
      }
      if (password && password === confirmPassword) {
        userFormData.password = password;
      }
      if (phone) {
        userFormData.phone = phone;
      }

      const image = await handleImageUpload();
      if (image && image.url) {
        userFormData.profilePic = image.url;
        setPhotoUrl(image.url);
      }

      const updatedUser = await updateUser(userFormData);
      console.log('Updated user:', updatedUser);

      if (updatedUser) {
        setUpdateStatus('success');
        window.location.reload(); // Set the update status to success
      } else {
        setUpdateStatus('error'); // Set the update status to error
      }
    }

    setName('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleDelete = () => {
    setOpen(true)
    console.log(open)
  }

  return (
    <div className='profile-container bg-gray-100 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex justify-end px-4 pt-4'></div>
        <div className='flex flex-col items-center pb-10'>
          {userPhoto ? (
            <img
              className='img-container w-24 h-25 mb-3 rounded-full shadow-lg'
              src={photoUrl}
              alt=''
            />
          ) : (
            <img
              className='img-container w-24 h-25 mb-3 rounded-full shadow-lg'
              src={data?.data.profilePic || './no-profile-picture-icon.png'}
              alt=''
            />
          )}
          <h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
            {data?.data.name}
          </h5>
          {updateStatus === 'success' && (
            <div className='text-green-500'>Update successful!</div>
          )}
          {updateStatus === 'error' && (
            <div className='text-red-500'>Update failed. Please try again.</div>
          )}
          <form
            className='edit-profile-form'
            onSubmit={handleSubmitChanges}
          >
            <ImageUploader onImageSelect={setUserPhoto} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              name='username'
              placeholder={data?.data.name}
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type='text'
              name='phone'
              placeholder='Phone number'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              name='password'
              placeholder='Change Password'
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
              className='btn btn-success'
            >
              Save Changes
            </button>
          </form>
          <div className='flex mt-4 space-x-3 md:mt-6'>
            <button
              type='submit'
              className='btn btn-error'
              onClick={handleDelete}
            >
              Delete Account
            </button>
            {open ? ( <Delete setOpen={setOpen}/>
                 ) : (
                null  )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;