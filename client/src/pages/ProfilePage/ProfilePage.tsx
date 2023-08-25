import { useState } from 'react';
import './ProfilePage.css';
import { useGetUserQuery } from '../../services/ThesisDB';
import { UserState } from '../../reduxFiles/slices/users';
import { useAuth } from '../../utils/useAuth';
import { useUpdateUserMutation } from '../../services/ThesisDB';
import Delete from '../../components/Delete';

const ProfilePage = (): any => {
  const ImageUploader = ({
    onImageSelect,
  }: {
    onImageSelect: (file: File) => void;
  }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const selectedFile = e.target.files[0];
        onImageSelect(selectedFile);

        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    };

    return (
      <div className='overflow-y-hidden upload-btn mb-3'>
        <input
          id='profilePic'
          type='file'
          name='profilePic'
          accept='image/*'
          className='file-input-bordered file-input w-full max-w-xs'
          onChange={handleImageChange}
        />
      </div>
    );
  };
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userPhoto, setUserPhoto] = useState<File | null | string>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const uid = localStorage.getItem('token');
  useAuth();
  //@ts-ignore
  const { data } = useGetUserQuery(uid);
  //@ts-ignore

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
        if (uploadedImage && uploadedImage.secure_url) {
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
      if (email) {
        userFormData.email = email;
      }

      const image = await handleImageUpload();
      if (image && image.url) {
        userFormData.profilePic = image.url;
        setPhotoUrl(image.url);
      }

      const updatedUser = await updateUser(userFormData);

      if (updatedUser) {
        setUpdateStatus('success');
        window.location.reload(); // Set the update status to success
      } else {
        setUpdateStatus('error'); // Set the update status to error
      }
    }

    setName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div className='profile-container bg-white min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-lg border-indigo-950 border-2 rounded-xl bg-white my-8'>
        <div className='flex flex-col items-center pb-10 '>
          {previewUrl || userPhoto ? (
            <img
              className='img-container'
              src={previewUrl ? previewUrl : photoUrl}
              alt=''
            />
          ) : (
            <img
              className='img-container'
              src={data?.data.profilePic || './no-profile-picture-icon.png'}
              alt=''
            />
          )}
          <h5 className='text-4xl font-bold pb-3 text-pink-500 mb-5'>
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
              placeholder={data?.data.name || 'Name'}
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='text'
              name='email'
              placeholder={data?.data.email || 'Enter email'}
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type='text'
              name='phone'
              placeholder={data?.data.phone || 'Phone number'}
              className="shadow-sm 
              bg-gray-50 border border-gray-300 
              text-gray-900 text-sm 
              rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 
              block w-full p-2.5"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              name='password'
              placeholder='Change Password'
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type='password'
              name='confirmpassword'
              placeholder='Confirm Password'
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
            />
            <div className='profile-btn'>
              <div>
                <button
                  type='submit'
                  id='save-profile'
                  className='btn text-md font-medium text-white bg-indigo-800 hover:bg-indigo-950 hover:text-pink-700'
                >
                  Save Changes
                </button>
              </div>
              <div>
                <button
                  type='submit'
                  id='delete-profile'
                  className='btn text-md font-medium bg-pink-500 text-white hover:bg-pink-700 hover:text-indigo-700'
                  onClick={handleDelete}
                >
                  Delete Account
                </button>
                {open ? <Delete setOpen={setOpen} /> : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
