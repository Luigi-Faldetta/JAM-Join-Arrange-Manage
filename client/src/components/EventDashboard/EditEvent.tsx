import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import {
  EventState,
  updateEvent,
} from '../../reduxFiles/slices/events';
import { useUpdateEventMutation } from '../../services/JamDB';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FiX,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiImage,
  FiLoader,
  FiSave,
} from 'react-icons/fi';

interface EditEventProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  eventData: any;
}

function EditEvent({ open, setOpen, eventData }: EditEventProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [patchEvent] = useUpdateEventMutation();

  // Initialize form with existing event data
  useEffect(() => {
    if (eventData && open) {
      setTitle(eventData.title || '');
      setLocation(eventData.location || '');
      setDescription(eventData.description || '');
      setEventDate(eventData.date ? new Date(eventData.date) : null);
      setPreviewUrl(eventData.coverPic || null);
    }
  }, [eventData, open]);
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const eventFormData: Partial<EventState> = {
        eventId: eventData?.eventId,
      };

      // Only include fields that have been modified
      if (title.trim() && title !== eventData?.title) {
        eventFormData.title = title.trim();
      }
      if (location.trim() && location !== eventData?.location) {
        eventFormData.location = location.trim();
      }
      if (description.trim() && description !== eventData?.description) {
        eventFormData.description = description.trim();
      }
      if (eventDate && eventDate.getTime() !== new Date(eventData?.date || '').getTime()) {
        eventFormData.date = eventDate;
      }

      const image = await handleImageUpload();
      if (image?.secure_url) {
        eventFormData.coverPic = image.secure_url;
      }

      console.log('Updating event with data:', eventFormData);

      const eventChanged = await patchEvent(eventFormData);
      
      if ('data' in eventChanged && eventChanged.data.success) {
        dispatch(updateEvent(eventChanged.data.data));
        console.log('Event updated successfully!');
      } else {
        console.error('Event update failed:', eventChanged);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsLoading(false);
    }
  };
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

  const handleClose = () => {
    setOpen(false);
    // Reset form
    setTitle('');
    setLocation('');
    setDescription('');
    setEventDate(null);
    setEventFile(null);
    setPreviewUrl(null);
  };

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
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-600 dark:border-gray-700 w-full max-w-2xl max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {t.editModal.editEvent}
                  </h2>
                  <p className="text-purple-100">{t.editModal.updateEventDetails}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-white hover:bg-white/20 rounded-xl transition-colors duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[calc(95vh-120px)] overflow-y-auto">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.editModal.eventName} {t.editModal.required}
                </label>
                <input
                  name="eventName"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-gray-500"
                  placeholder={t.editModal.eventNamePlaceholder}
                  required
                  autoComplete="off"
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.editModal.dateTime} {t.editModal.required}
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <DatePicker
                    selectsStart
                    placeholderText={t.editModal.selectDateTime}
                    showTimeSelect
                    selected={eventDate}
                    onChange={(date) => setEventDate(date)}
                    dateFormat="EEE, MMM d 'at' h:mm aa"
                    minDate={new Date()}
                    wrapperClassName="w-full"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-gray-500"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.editModal.location}
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    name="eventLocation"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-gray-500"
                    placeholder={t.editModal.locationPlaceholder}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.editModal.description}
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <textarea
                    name="eventDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-gray-500"
                    placeholder={t.editModal.descriptionPlaceholder}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.editModal.eventImage}
                </label>

                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt={t.editModal.eventPreview}
                      className="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(eventData?.coverPic || null);
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
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group"
                    >
                      <FiImage className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-purple-600">
                        {t.editModal.clickToUpload}
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
                    <span>{t.editModal.updatingEvent}</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>{t.editModal.updateEvent}</span>
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
}
export default EditEvent;
