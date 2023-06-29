import { useEffect, useState } from "react";

//@ts-nocheck
export default function Todos () {
    const [toDos, setToDos] = useState(["Get beer", "Buy pizza", "Bring chocolate"]);
    const [newToDo, setNewToDo] = useState("");
    const [doneToDos, setDoneToDos] = useState<string[]>([]);
   
    const handleAddClick = () => {
        if (newToDo.trim() !== "") {
          setToDos((prevToDos) => [...prevToDos, newToDo]); 
          setNewToDo(""); 
        }
      };

      const handleInputChange = (e:any) => {
        setNewToDo(e.target.value);
      };

      const handleDeleteClick = (index:number) => {
        setToDos((prevToDos) => {
          const updatedToDos = [...prevToDos];
          updatedToDos.splice(index, 1); 
          return updatedToDos;
        });
      };

    //   const handleDoneClick = (index:number) => {
    //     setToDos((prevToDos) => {
    //       const updatedToDos = [...prevToDos];
    //       const doneToDo = updatedToDos.splice(index, 1); 
    //       setDoneToDos((prevDoneToDos) => [...prevDoneToDos, doneToDo[0]]); 
    //       return updatedToDos;
    //     });
    //   };

    const handleDoneClick = (index:number) => {
        setDoneToDos((prevDoneToDos) => [...prevDoneToDos, toDos[index]]);
        setToDos((prevToDos) => prevToDos.filter((_, i) => i !== index));
      };
      
    

    return (
        <div className="flex justify-center">
        <div className="w-2/5 h-96 mx-20 bg-blue-500 rounded-lg flex mt-56 flex-col items-center overflow-y-scroll">
          <h1 className="p-6 text-2xl text-white">Todos</h1>
          <div className="ml-11">
            <input type="text" placeholder="Add new todo..." className="w-60 h-10" value={newToDo}
            onChange={handleInputChange}></input>
            <button onClick={handleAddClick} className="ml-3 p-1 w-8 text-lg rounded-md border border-slate-50">&#10133;</button>
          </div>
          <div className="mt-4 text-xl">
            {toDos.map((toDo, index) => (
                <div key={index} className="flex items-center"><h3 className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8">{toDo}</h3>
                <button
                className="text-white bg-red-500 p-2 rounded-md"
                onClick={() => handleDeleteClick(index)} 
              >
                Delete
              </button>
              <button
                className="text-white bg-green-500 p-2 rounded-md ml-2"
                onClick={() => handleDoneClick(index)} 
              >
                Done
              </button>
              </div>
                
            ))}
          </div>
        </div>    
        <div className="w-2/5 h-96 mx-20 bg-red-500 rounded-lg flex mt-56 flex-col items-center overflow-y-scroll">
            <h1 className="p-6 text-2xl text-white relative">Done</h1>
            <div className="mt-4 text-xl">
          {doneToDos.map((doneToDo, index) => (
            <h3
              key={index}
              className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8"
            >
              {doneToDo}
            </h3>
          ))}
        </div>
        </div>
        </div>
    )
}