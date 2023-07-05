import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../services/ThesisDB";
import { UserState } from "../../reduxFiles/slices/users";
import { useParams } from "react-router-dom";

interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  profilePic?: string | undefined;
  password: string;
}

export default function Attendees() {
  const { eventid } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const imagesPerSlide = 5;
  const apiUrl = `https://codeworks-thesis-4063bceaa74a.herokuapp.com/users/${eventid}`;

  const [attendees, setAttendees] = useState<UserState[]>([]);

  const { data, error, isLoading } = useGetUsersQuery(eventid as string);

  useEffect(() => {
    if (data) {
      const fetchedToDos = data.data;
      setAttendees(fetchedToDos);
    }
  }, [data]);

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    const lastIndex = Math.max(attendees.length - imagesPerSlide, 0);
    setActiveIndex((prevIndex) =>
      prevIndex < lastIndex ? prevIndex + 1 : prevIndex
    );
  };

  const renderImages = () => {
    const startIndex = activeIndex;
    const endIndex = Math.min(startIndex + imagesPerSlide, attendees.length);
    const renderedImages = [];

    for (let i = startIndex; i < endIndex; i++) {
      renderedImages.push(
        <div key={i} className="flex flex-col carousel-item m-4">
          <img
            src={attendees[i].profilePic}
            alt={`User${i + 1}`}
            className="rounded-full w-24 h-24 object-cover border-4 border-white"
          />
          <h4 className="text-center">{attendees[i].name}</h4>
        </div>
      );
    }

    return renderedImages;
  };

  return (
    <>
      <h2 className="absolute mt-1 ml-3 text-slate-600 text-center font-bold">
        GOING x{attendees.length}
      </h2>
      <div className="carousel carousel-center rounded-box w-4/5 mx-auto flex justify-center">
        {activeIndex > 0 && (
          <button
            className="carousel-arrow left-arrow"
            onClick={handlePrevious}
          >
            <span className="carousel-arrow-icon text-4xl">&lt;</span>
          </button>
        )}

        {renderImages()}

        {activeIndex < attendees.length - imagesPerSlide && (
          <button className="carousel-arrow right-arrow" onClick={handleNext}>
            <span className="carousel-arrow-icon text-4xl">&gt;</span>
          </button>
        )}
      </div>
    </>
  );
}
