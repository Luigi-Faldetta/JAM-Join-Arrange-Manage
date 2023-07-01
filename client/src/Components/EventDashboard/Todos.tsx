import { useEffect, useState } from "react";

interface toDo {
  title: string;
  isDone: boolean;
  id: string;
  creatorId: string;
  eventId: string;
}

const eventId = "0db2d486-6f41-4833-9856-8ea7c94fae6c";
const creatorId = "57cb0816-b2f3-43f2-86d4-71cfa16ad6ad";

export default function Todos() {
  const [toDos, setToDos] = useState<toDo[]>([]);
  const [newToDo, setNewToDo] = useState<toDo>({
    title: "",
    isDone: false,
    id: "",
    creatorId: creatorId,
    eventId: eventId,
  });
  const [doneToDos, setDoneToDos] = useState<toDo[]>([]);

  useEffect(() => {
    fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/todos/${eventId}`)
      .then((response) => response.json())
      .then((fetchedTodos) => {
        console.log(fetchedTodos);
        const allToDos = fetchedTodos.data;
        const doneToDos = allToDos.filter((toDo: toDo) => toDo.isDone);
        const pendingToDos = allToDos.filter((toDo: toDo) => !toDo.isDone);
        setToDos(pendingToDos);
        setDoneToDos(doneToDos);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  const handleAddClick = () => {
    console.log(newToDo);
    if (String(newToDo) !== "") {
      const newToDoItem = {
        title: newToDo,
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
          console.log(createdToDo);
          setToDos((prevToDos) => [...prevToDos, createdToDo.data]);
        })
        .catch((error) => {
          console.error("Error creating todo:", error);
        });

      setNewToDo({
        title: "",
        isDone: false,
        id: "",
        creatorId: creatorId,
        eventId: eventId,
      });
    }
  };

  const handleInputChange = (e: any) => {
    setNewToDo(e.target.value);
    console.log(newToDo)
  };

  const handleDeleteClick = (index: number) => {
    const todoId = toDos[index].id;

    fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/todo/${todoId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((deletedTodo) => {
        console.log(deletedTodo);
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
    setToDos((prevToDos) => {
      const updatedToDos = prevToDos.map((toDo, i) => {
        if (i === index) {
          return { ...toDo, isDone: true };
        }
        return toDo;
      });
      return updatedToDos.filter((toDo) => !toDo.isDone);
    });

    setDoneToDos((prevDoneToDos) => [...prevDoneToDos, toDos[index]]);
  };


  const handleMoveToTodosClick = (index: number) => {
    setDoneToDos((prevDoneToDos) => {
      const updatedDoneToDos = [...prevDoneToDos];
      const doneToDo = updatedDoneToDos.splice(index, 1);
      setToDos((prevToDos) => [...prevToDos, doneToDo[0]]);
      return updatedDoneToDos;
    });
  };



  return (
    <div className="flex justify-center">
      <div className="w-2/5 h-96 mx-20 bg-blue-500 rounded-lg flex mt-36 flex-col items-center overflow-y-scroll">
        <h1 className="p-6 text-2xl text-white">Todos</h1>
        <div className="ml-11">
          <input type="text" placeholder="Add a new todo..." className="w-60 h-10" value={newToDo.title}
            onChange={handleInputChange}></input>
          <button onClick={handleAddClick} className="ml-3 p-1 w-8 text-lg rounded-md border border-slate-50">&#10133;</button>
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
              <h3 key={index} className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8">
                {toDo.title}
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
            <div className="flex items-center">
              <h3
                key={index}
                className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8"
              >
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
  )
}
