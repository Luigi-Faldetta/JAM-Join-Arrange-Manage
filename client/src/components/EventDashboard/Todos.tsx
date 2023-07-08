import { useEffect, useRef, useState } from "react";
import { useGetToDosQuery, useUpdateToDoMutation, useAddToDoMutation, useDeleteToDoMutation } from "../../services/ThesisDB";
import { ToDoState, addToToDoList, deleteToDoFromList, setToDoList, updateToDoList } from "../../reduxFiles/slices/toDos";
import { useParams } from "react-router-dom";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { useSelector } from "react-redux";


export default function Todos(): JSX.Element {
  const { eventid } = useParams();
  const creatorId = localStorage.getItem("token");
  const [addTodo] = useAddToDoMutation();
  const [deleteTodo] = useDeleteToDoMutation();
  const [updateTodo] = useUpdateToDoMutation()
  const toDoList = useSelector((state: RootState) => state.toDoListReducer)
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
      appDispatch(setToDoList(toDos));
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
        appDispatch(addToToDoList(toDoRes.data.data))
      }
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


  const handleDeleteClick = (toDoId:string) => {
    deleteTodo(toDoId);
    appDispatch(deleteToDoFromList(toDoId));
  };

  const handleDoneClick = async (toDoId:string) => {
    const index = toDoList.indexOf(toDoList.find(todo => todo.id === toDoId) as ToDoState)
    await updateTodo({id:toDoId, isDone: !toDoList[index].isDone});
    appDispatch(updateToDoList(toDoId))
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
          {toDoList.filter(todo => todo.isDone === false).map(toDo => (
            <div
              className="flex items-center p-2 border-t border-gray-400 text-white text-xl"
              key={toDo.id}
            >
              <button
                id="x-btn"
                className="w-10 text-gray-400 cursor-pointer"
                onClick={() => handleDeleteClick(toDo.id as string)}
              >
                X
              </button>
              <h3 key={toDo.id} className="w-full">
                {toDo?.title}
              </h3>
              <ImArrowRight
                id="pink-arrow"
                className="w-10 fill-pink-500 cursor-pointer"
                onClick={() => handleDoneClick(toDo.id as string)}
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
          {toDoList.filter(todo => todo.isDone === true).map((toDo, index) => (
            <div
              className="flex items-center p-2 border-t border-gray-400 text-white text-xl"
              key={toDo.id}
            >
              <ImArrowLeft
                className="w-10 fill-pink-500 cursor-pointer"
                onClick={() => handleDoneClick(toDo.id as string)}
              />
              <h3 className="w-full ml-1">{toDo.title}</h3>
              <button
                className="w-10 text-gray-400 cursor-pointer"
                onClick={() => handleDeleteClick(toDo.id as string)}
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
