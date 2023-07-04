import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteEventMutation } from "../../services/ThesisDB";
import { useDispatch } from "react-redux";
import { ApiResponse } from "../../services/ApiResponseType";
// import { deleteEvent } from "../../reduxFiles/slices/events";

interface DeleteEventProps {
  setDeleteModalOpen: (isOpen: boolean) => void;
}

function DeleteEvent({ setDeleteModalOpen }: DeleteEventProps) {
  const dispatch = useDispatch();
  const [deleteEvent] = useDeleteEventMutation();

  const navigate = useNavigate();

  function handleCancelDelete() {
    console.log("hello in cancel");
    setDeleteModalOpen(false);
  }

  async function handleDelete(e: any) {
    console.log("hello");
    e.preventDefault();
    const { eventid } = useParams();

    try {
      const res = await deleteEvent(eventid as string);
      console.log(" deleted event => ", res);
      navigate("/user-dashboard");
      setDeleteModalOpen(false);
      //@ts-ignore
      // dispatch(deleteEvent((deletedEvent as any).data));
    } catch (error) {
      console.log("error in delete", error);
    }
  }

  return (
    <>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-white-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Delete event?
                    </h3>
                    <div className="mt-2">
                      <p className="text-md text-gray-500">
                        Are you sure you want to delete this event?{" "}
                      </p>
                      <p className="text-sm text-gray-500">
                        Your friends will be sad 😔
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={handleDelete}
                  type="button"
                  className=" inline-flex w-full justify-center px-3 py-2  focus:outline-none focus:ring-red-300 rounded-md bg-red-600 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-800 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}

export default function DeleteEventButton() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  return (
    <>
      <button
        onClick={() => openDeleteModal()}
        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-red-800 hover:text-white sm:mt-0 sm:w-auto"
      >
        Delete
      </button>

      {deleteModalOpen && (
        <DeleteEvent setDeleteModalOpen={setDeleteModalOpen} />
      )}
    </>
  );
}
