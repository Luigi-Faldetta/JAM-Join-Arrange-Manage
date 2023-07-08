import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../services/ThesisDB";
import { createUserList } from "../../reduxFiles/slices/users";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import "./Attendees.css";

export default function Attendees() {
  const { eventid } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const imagesPerSlide = 100;
  const appDispatch = useAppDispatch()
  const attendees = useSelector((state: RootState) => state.userList);

  const { data, error, isLoading } = useGetUsersQuery(eventid as string);

  useEffect(() => {
    if (data) {
      const fetchedToDos = data.data;
      appDispatch(createUserList(fetchedToDos));
      
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
        <div key={i} className="flex flex-col shrink-0">
          <img
            src={attendees[i].profilePic ? attendees[i].profilePic : "https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688557267/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju_wprc8v.jpg"}
            alt={`User${i + 1}`}
            className="rounded-full w-16 md:w-24 h-16 md:h-24 object-cover border-4 border-white"
          />
          <h4 className="text-center">{attendees[i].name}</h4>
        </div>
      );
    }

    return renderedImages;
  };

  return (
    <>
      <div className="hidden lg:block absolute flex-col justify-center mt-5 w-16 mx-4 text-center">
        <h1 className="text-6xl font-bold text-slate-600">{attendees.length}</h1>
        <h2 className="relative text-slate-600 font-bold">        GOING      </h2>
      </div>
      <div className="attendees-row relative w-full flex flex-row justify-center items-center">
        <div className="gradientback-left"></div>
        <div className="gradientback-right"></div>
        <div className="flex flex-row gap-4 justify-start overflow-x-auto">
          {renderImages()}
        </div>
      </div>

    </>
  );
}
