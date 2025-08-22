import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import {
  addEventToList,
  setEvent,
  EventState,
} from '../../reduxFiles/slices/events';
import { useAddEventMutation, useGetMeQuery } from '../../services/JamDB';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FiPlus,
  FiX,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiImage,
  FiLoader,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';

function CreateEventForm() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addEvent] = useAddEventMutation();
  const { data: userData, refetch: refetchMe } = useGetMeQuery();
  const userId = userData?.data?.userId;

  const handleImageUpload = async () => {
    if (eventFile) {
      const data = new FormData();
      data.append('file', eventFile);
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
        return uploadedImage;
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      return null;
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!userId) {
      console.error('User ID not available');
      setErrorMessage(t.createEvent.userIdentificationError);
      setIsLoading(false);
      
      // Try to refetch user data
      refetchMe();
      return;
    }

    try {
      const eventFormData: Partial<EventState> & Pick<EventState, 'title'> & { userId: string } = {
        title: event.currentTarget.eventName.value,
        date: eventDate,
        location: event.currentTarget.eventLocation.value,
        description: event.currentTarget.eventDescription.value,
        userId: userId || '',
      };

      const image = await handleImageUpload();

      // Fix the property name - it should be 'secure_url', not 'url'
      if (image?.secure_url) {
        eventFormData.coverPic = image.secure_url;
      }

      console.log('Creating event with data:', eventFormData);

      // Remove the token parameter - RTK Query will handle the authorization header automatically
      const eventCreated = await addEvent(eventFormData);

      console.log('Event creation result:', eventCreated);

      // Always close the modal and reset form after submission
      setOpen(false);
      
      // Reset form
      setEventDate(null);
      setEventFile(null);
      setPreviewUrl(null);
      event.currentTarget.reset();

      if ('data' in eventCreated && eventCreated.data.success) {
        dispatch(setEvent(eventCreated.data.data));
        dispatch(addEventToList(eventCreated.data.data));
        console.log('Event created successfully!');
      } else {
        console.error('Event creation failed:', eventCreated);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createModal = () => {
    if (!open) return null;

    return createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Modal Container - This ensures proper centering */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[95vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {t.createEvent.title}
                    </h2>
                    <p className="text-purple-100">{t.createEvent.subtitle}</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 text-white hover:bg-white/20 rounded-xl transition-colors duration-200"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[calc(95vh-120px)] overflow-y-auto">
                {/* Error Message */}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center">
                    <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}
                
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.createEvent.eventName} {t.createEvent.requiredField}
                  </label>
                  <input
                    name="eventName"
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder={t.createEvent.eventNamePlaceholder}
                    required
                    autoComplete="off"
                  />
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.createEvent.dateTime} {t.createEvent.requiredField}
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <DatePicker
                      selectsStart
                      placeholderText={t.createEvent.selectDateTime}
                      showTimeSelect
                      selected={eventDate}
                      onChange={(date) => setEventDate(date)}
                      dateFormat="EEE, MMM d 'at' h:mm aa"
                      minDate={new Date()}
                      wrapperClassName="w-full"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500"
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.createEvent.location}
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="eventLocation"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500"
                      placeholder={t.createEvent.locationPlaceholderLong}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.createEvent.description}
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="eventDescription"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-white text-gray-900 placeholder:text-gray-500"
                      placeholder={t.createEvent.descriptionPlaceholderLong}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.createEvent.eventImage}
                  </label>

                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt={t.common.altText.eventPreview}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setEventFile(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="event-image"
                      />
                      <label
                        htmlFor="event-image"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
                      >
                        <FiImage className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2" />
                        <span className="text-sm text-gray-600 group-hover:text-purple-600">
                          {t.createEvent.clickToUpload}
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      <span>{t.createEvent.creatingEvent}</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span>{t.createEvent.create}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <FiPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        <span>{t.createEvent.hostEvent}</span>
      </button>
      {createModal()}
    </>
  );
}

export default CreateEventForm;
