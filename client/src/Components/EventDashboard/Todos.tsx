import { useEffect, useState } from "react";
import { useGetToDosQuery } from "../../services/ThesisDB";
import { ToDoState } from "../../reduxFiles/slices/toDos";
import { useAddToDoMutation } from "../../services/ThesisDB";
import { useParams } from "react-router-dom";

export default function Todos(): JSX.Element {
  const { eventid } = useParams();
  console.log(eventid);
  const creatorId = localStorage.getItem("token");
  const [toDos, setToDos] = useState<ToDoState[]>([]);
  const [newToDo, setNewToDo] = useState<ToDoState>({
    title: "",
    isDone: false,
    id: "",
    creatorId: "",
    eventId: "",
  });
  const [doneToDos, setDoneToDos] = useState<ToDoState[]>([]);

  const { data, error, isLoading } = useGetToDosQuery(eventid as string);

  useEffect(() => {
    if (data) {
      const fetchedToDos = data.data;
      const todos = fetchedToDos.filter((todo) => !todo.isDone);
      const doneTodos = fetchedToDos.filter((todo) => todo.isDone);
      setToDos(todos);
      setDoneToDos(doneTodos);
    }
  }, [data]);

  const handleAddClick = (e: any) => {
    e.preventDefault();
    if (newToDo.title !== "") {
      const newToDoItem = {
        title: newToDo.title,
        isDone: false,
        creatorId: creatorId,
        eventId: eventid,
      };
      console.log(newToDoItem);
      fetch("https://codeworks-thesis-4063bceaa74a.herokuapp.com/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newToDoItem),
      })
        .then((response) => response.json())
        .then((createdToDo) => {
          if (createdToDo.success) {
            setToDos((prevToDos) => [...prevToDos, createdToDo.data]);
          } else {
            alert(createdToDo.message);
          }
        })
        .catch((error) => {
          console.error("Error creating todo:", error);
        });
      setNewToDo({
        title: "",
        isDone: false,
        id: "",
        creatorId: "",
        eventId: eventid as string,
      });
    }
  };

  const handleInputChange = (e: any) => {
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
    <div className="flex justify-center gap-4">

      <div className="w-1/2 h-96 p-4 bg-indigo-950 rounded-xl flex flex-col">
        <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">TODOS</h1>
        <div className="w-full">
          {toDos.map((toDo, index) => (
            <div className="flex p-2 border-t border-gray-400 text-white text-xl" key={index}>
              <button
                className="w-10 text-gray-400"
                onClick={() => handleDeleteClick(index)}
              >X</button>
              <h3 key={index} className="w-full" >{toDo?.title}</h3>
              <button
                className="w-10 text-pink-500 font-black"
                onClick={() => handleDoneClick(index)}
              >{'>'}</button>
            </div>
          ))}

          <div className="text-white text-xl ">
            <form onSubmit={handleAddClick} className="flex p-1 pt-3 ">
              <input
                type="text"
                placeholder="Add item"
                className="ml-4 w-full h-10 border-0 border-b border-gray-400 bg-indigo-950"
                value={newToDo.title}
                onChange={handleInputChange}
              />
              <button type="submit"
                className="w-12 font-bold rounded-full border border-gray-400"
              >+</button>
            </form>
          </div>

        </div>
      </div>

      <div className="w-1/2 h-96 p-4 bg-indigo-950 rounded-xl flex flex-col">
        <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">COMPLETED</h1>
        <div className="w-full">
          {doneToDos.map((doneToDo, index) => (
            <div className="flex p-2 border-t border-gray-400 text-white text-xl" key={index}>
              <button
                className="w-10 text-pink-500 font-black"
                onClick={() => handleMoveToTodosClick(index)}
              >{'<'}</button>
              <h3 className="w-full">
                {doneToDo.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
