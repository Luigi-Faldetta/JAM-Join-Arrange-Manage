import { useEffect, useRef, useState } from "react";
import { useGetToDosQuery } from "../../services/ThesisDB";
import { ToDoState, setToDoList, updateToDoList } from "../../reduxFiles/slices/toDos";
import { useAddToDoMutation, useDeleteToDoMutation } from "../../services/ThesisDB";
import { useParams } from "react-router-dom";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { useSelector } from "react-redux";


export default function Todos(): JSX.Element {
  const { eventid } = useParams();
  const creatorId = localStorage.getItem("token");
  // const [toDos, setToDos] = useState<ToDoState[]>([]);
  // const [doneToDos, setDoneToDos] = useState<ToDoState[]>([]);
  const [addTodo] = useAddToDoMutation();
  const [deletedTodo] = useDeleteToDoMutation();
  const toDoList = useSelector((state: RootState) => state.eventListReducer)
  const appDispatch = useAppDispatch()
  const [newToDo, setNewToDo] = useState<ToDoState>({
    title: "",
    isDone: false,
    id: "",
    creatorId: "",
    eventId: "",
  });

  const { data, error, isLoading } = useGetToDosQuery(eventid as string);
  const todosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      const toDos = data.data;
      // const todos = fetchedToDos.filter((todo) => !todo.isDone);
      // const doneTodos = fetchedToDos.filter((todo) => todo.isDone);
      appDispatch(setToDoList(toDos));
      // setDoneToDos(doneTodos);
    }
  }, [data]);

  useEffect(() => {
    // Scroll to the bottom of the todos div
    if (todosRef.current) {
      todosRef.current.scrollTop = todosRef.current.scrollHeight;
    }
  }, [toDoList]);

  const handleAddClick = async (e: any) => {
    e.preventDefault();
    if (newToDo.title !== "") {
      const newToDoItem = {
        title: newToDo.title,
        isDone: false,
        creatorId: creatorId,
        eventId: eventid,
      };
      const toDoRes = await addTodo(newToDoItem as ToDoState) 
      if('data' in toDoRes){
        appDispatch(updateToDoList(toDoRes.data.data))
      }
      // fetch("https://codeworks-thesis-4063bceaa74a.herokuapp.com/todo", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newToDoItem),
      // })
      //   .then((response) => response.json())
      //   .then((createdToDo) => {
      //     if (createdToDo.success) {
      //       setToDos((prevToDos) => [...prevToDos, createdToDo.data]);
      //     } else {
      //       alert(createdToDo.message);
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error creating todo:", error);
      //   });
      setNewToDo({
        title: "",
        isDone: false,
        id: "",
        creatorId: "",
        eventId: eventid as string,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDo = {
      title: e.target.value,
      isDone: false,
      creatorId: creatorId,
      eventId: eventid,
    };
    setNewToDo(newToDo as any);
  };


  const handleDeleteClick = (index: number) => {
    const todoId = toDos[index].id;

    fetch(
      `https://codeworks-thesis-4063bceaa74a.herokuapp.com/todo/${todoId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((deletedTodo) => {
        setToDos((prevToDos) => {
          const updatedToDos = [...prevToDos];
          updatedToDos.splice(index, 1);
          return updatedToDos;
        });
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const handleDoneClick = (index: number) => {
    const todoId = toDos[index].id;

    // Update the isDone property of the todo in the database
    fetch(
      `https://codeworks-thesis-4063bceaa74a.herokuapp.com/todo/${todoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDone: true }),
      }
    )
      .then((response) => response.json())
      .then((updatedTodo) => {
        setToDos((prevToDos) => {
          const updatedToDos = [...prevToDos];
          updatedToDos.splice(index, 1); // Remove the todo from Todos
          return updatedToDos;
        });
        setDoneToDos((prevDoneToDos) => [...prevDoneToDos, updatedTodo.data]);
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  const handleMoveToTodosClick = (index: number) => {
    const doneToDo = doneToDos[index];
    const todoId = doneToDo.id;

    fetch(
      `https://codeworks-thesis-4063bceaa74a.herokuapp.com/todo/${todoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDone: false }),
      }
    )
      .then((response) => response.json())
      .then((updatedTodo) => {
        setDoneToDos((prevDoneToDos) => {
          const updatedDoneToDos = [...prevDoneToDos];
          updatedDoneToDos.splice(index, 1);
          return updatedDoneToDos;
        });
        setToDos((prevToDos) => [...prevToDos, updatedTodo.data]);
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  return (




    <div className="flex flex-col lg:flex-row justify-center gap-4">
      <div className="lg:w-1/2 h-96 p-4 bg-gradient-to-r from-indigo-950 to-indigo-900 border-2 border-indigo-950 rounded-xl flex flex-col">
        <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">
          TODOS
        </h1>
        <div
          ref={todosRef}
          className="w-full flex-grow  flex flex-col overflow-y-auto"
        >
          {toDos.map((toDo, index) => (
            <div
              className="flex items-center p-2 border-t border-gray-400 text-white text-xl"
              key={index}
            >
              <button
                id="x-btn"
                className="w-10 text-gray-400 cursor-pointer"
                onClick={() => handleDeleteClick(index)}
              >
                X
              </button>
              <h3 key={index} className="w-full">
                {toDo?.title}
              </h3>
              <ImArrowRight
                id="pink-arrow"
                className="w-10 fill-pink-500 cursor-pointer"
                onClick={() => handleDoneClick(index)}
              />
            </div>
          ))}
          <form onSubmit={handleAddClick} className="text-white mt-auto flex p-1 pt-3">
            <input
              type="text"
              id="add-item"
              placeholder="Add item"
              className="ml-4 w-full h-10 border-0 border-b border-gray-400 bg-indigo-950"
              value={newToDo.title}
              onChange={handleInputChange}
              autoComplete="off" // Disable autocomplete
              autoCorrect="off" // Disable autocorrect
              autoCapitalize="off" // Disable autocapitalize
              spellCheck="false" // Disable spellcheck
          />
            <button
              type="submit"
              className="w-10 ml-2 font-bold rounded-full border border-gray-400 flex items-center justify-center"
            >
              +
            </button>
          </form>
        </div>
      </div>

      <div className="lg:w-1/2 h-96 p-4 bg-gradient-to-r from-indigo-900 to-indigo-950 border-2 border-indigo-950 rounded-xl flex flex-col">
        <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">
          COMPLETED
        </h1>
        <div className="w-full flex-grow overflow-y-auto">
          {doneToDos.map((doneToDo, index) => (
            <div
              className="flex items-center p-2 border-t border-gray-400 text-white text-xl"
              key={index}
            >
              <ImArrowLeft
                className="w-10 fill-pink-500 cursor-pointer"
                onClick={() => handleMoveToTodosClick(index)}
              />
              <h3 className="w-full ml-1">{doneToDo.title}</h3>
              <button
                className="w-10 text-gray-400 cursor-pointer"
                onClick={() => handleDeleteClick(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
