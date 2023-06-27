

export default function Todos () {
    return (
        <div className="flex justify-center">
        <div className="w-2/5 h-96 mx-20 mt-44 bg-blue-500 rounded-lg">
          <h1 className="p-6 text-2xl">Todos</h1>    
        </div>    
        <div className="w-2/5 h-96 mx-20 mt-44 bg-red-500 rounded-lg">
            <h1 className="p-6 text-2xl">Done</h1>
        </div>
        </div>
    )
}