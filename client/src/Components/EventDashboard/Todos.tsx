

export default function Todos () {
    return (
        <div className="flex justify-center">
        <div className="w-2/5 h-96 mx-20 bg-blue-500 rounded-lg flex justify-center mt-56">
          <h1 className="p-6 text-2xl text-white">Todos</h1>    
        </div>    
        <div className="w-2/5 h-96 mx-20 bg-red-500 rounded-lg flex justify-center mt-56">
            <h1 className="p-6 text-2xl text-white">Done</h1>
        </div>
        </div>
    )
}