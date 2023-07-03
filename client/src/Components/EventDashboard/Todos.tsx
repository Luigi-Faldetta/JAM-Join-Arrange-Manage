import { useEffect, useState } from "react";
import { useGetToDosQuery } from "../../services/ThesisDB";
import { ToDoState } from "../../reduxFiles/slices/toDos";
import { useAddToDoMutation } from "../../services/ThesisDB";
import { useParams } from "react-router-dom";

// const eventId = "d2913de4-1ef3-4f3a-b885-9e2a8120611b";

const creatorId = "ddad6a7d-d18c-4fd4-96b3-e6814cd3a3e7";

export default function Todos(): JSX.Element {
  const { eventId } = useParams();

  const [toDos, setToDos] = useState<ToDoState[]>([]);
  const [newToDo, setNewToDo] = useState<ToDoState>({
    title: "",
    isDone: false,
    id: "",
    creatorId: creatorId,
    eventId: eventId as string,
  });
  const [doneToDos, setDoneToDos] = useState<ToDoState[]>([]);

  const { data, error, isLoading } = useGetToDosQuery(eventId as string);

  useEffect(() => {
    if (data) {
      const fetchedToDos = data.data;
      const todos = fetchedToDos.filter((todo) => !todo.isDone);
      const doneTodos = fetchedToDos.filter((todo) => todo.isDone);
      setToDos(todos);
      setDoneToDos(doneTodos);
    }
  }, [data]);

  const handleAddClick = () => {
    if (newToDo.title !== "") {
      const newToDoItem = {
        title: newToDo.title,
        isDone: false,
        creatorId: creatorId,
        eventId: eventId,
      };
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
        creatorId: creatorId,
        eventId: eventId as string,
      });
    }
  };

  const handleInputChange = (e: any) => {
    const newToDo = {
      title: e.target.value,
      isDone: false,
      creatorId: creatorId,
      eventId: eventId,
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
    <div className="flex justify-center">
      <div className="w-2/5 h-96 mx-20 bg-blue-500 rounded-lg flex mt-36 flex-col items-center overflow-y-scroll">
        <h1 className="p-6 text-2xl text-white">Todos</h1>
        <div className="ml-11">
          <input
            type="text"
            placeholder="Add a new todo..."
            className="w-60 h-10"
            value={newToDo.title}
            onChange={handleInputChange}
          />
          <button
            onClick={handleAddClick}
            className="ml-3 p-1 w-8 text-lg rounded-md border border-slate-50"
          >
            &#10133;
          </button>
        </div>
        <div className="mt-4 text-xl">
          {toDos.map((toDo, index) => (
            <div className="flex items-center" key={index}>
              <button
                className="text-white rounded-md text-xl"
                onClick={() => handleDeleteClick(index)}
              >
                ❌
              </button>
              <h3
                key={index}
                className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8"
              >
                {toDo?.title}
              </h3>
              <button
                className="text-white rounded-md text-2xl"
                onClick={() => handleDoneClick(index)}
              >
                ✅
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/5 h-96 mx-20 bg-red-500 rounded-lg flex mt-36 flex-col items-center overflow-y-scroll">
        <h1 className="p-6 text-2xl text-white relative">Done</h1>
        <div className="mt-4 text-xl">
          {doneToDos.map((doneToDo, index) => (
            <div className="flex items-center" key={index}>
              <h3 className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8">
                {doneToDo.title}
              </h3>
              <button
                className="text-white rounded-md text-2xl"
                onClick={() => handleMoveToTodosClick(index)}
              >
                ↩️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
