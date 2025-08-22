import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../reduxFiles/store';
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useGetMeQuery,
} from '../../services/JamDB';
import { setToDoList, addToToDoList, deleteToDoFromList, updateToDoList, editToDoInList } from '../../reduxFiles/slices/toDos';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FiPlus,
  FiCheck,
  FiX,
  FiEdit3,
  FiTrash2,
  FiLoader,
  FiCheckCircle,
  FiCircle,
  FiClock,
} from 'react-icons/fi';

// UI type
interface Todo {
  todoId: string;
  task: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Redux state type
interface ToDoState {
  id?: string;
  title: string;
  isDone: boolean;
  creatorId: string;
  eventId: string;
}

export default function Todos() {
  const { t } = useTranslation();
  const { eventid } = useParams();
  const dispatch = useAppDispatch();

  // Get raw Redux state for deletion operations
  const rawTodosFromRedux = useSelector((state: RootState) => state.toDoListReducer);
  
  // Select and map Redux state to UI type
  const todos = useSelector((state: RootState) => {
    console.log('Redux todos state:', state.toDoListReducer);
    return Array.isArray(state.toDoListReducer)
      ? state.toDoListReducer
          .filter((todo): todo is ToDoState => typeof todo.id === 'string' || typeof todo.id === 'number')
          .map((todo) => ({
            todoId: String(todo.id!),
            task: todo.title,
            isCompleted: todo.isDone,
            createdAt: '', // Fill if available
            updatedAt: '', // Fill if available
          }))
      : []
  });

  const [newTask, setNewTask] = useState('');
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // API hooks
  const { data: todosData, isLoading, error: todosError, refetch: refetchTodos } = useGetTodosQuery(eventid as string, {
    // Skip the initial query if we have no todos in Redux to avoid initial 500 error
    skip: false // Always query for now
  });
  const { data: userData } = useGetMeQuery();
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  useEffect(() => {
    console.log('Todos useEffect triggered with:', { todosData, todosError });
    
    // Prioritize successful data over errors
    if (todosData?.data && Array.isArray(todosData.data)) {
      if (todosData.data.length > 0) {
        console.log('Setting todos data:', todosData.data);
        console.log('Sample todo item structure:', todosData.data[0]);
        dispatch(setToDoList(todosData.data));
      } else {
        // Handle empty array response
        console.log('Setting empty todos - received empty array');
        dispatch(setToDoList([]));
      }
    } else if (todosError && 'status' in todosError && todosError.status === 500 && !todosData?.data) {
      // Only handle error if there's no successful data
      const errorMessage = (todosError.data as any)?.message;
      if (errorMessage === 'No todos were found') {
        console.log('No todos found for this event (expected when event has no todos)');
        dispatch(setToDoList([]));
      } else {
        console.error('Unexpected 500 error:', errorMessage);
        dispatch(setToDoList([]));
      }
    }
  }, [todosData, todosError, dispatch]);

  const pendingTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  const handleAddTask = async () => {
    if (!newTask.trim() || isCreating || !userData?.data?.userId) return;

    console.log('Creating todo with data:', {
      eventId: eventid as string,
      title: newTask.trim(),
      creatorId: userData.data.userId,
    });

    try {
      const result = await createTodo({
        eventId: eventid as string,
        title: newTask.trim(),
        creatorId: userData.data.userId,
      });

      console.log('Todo creation result:', result);
      console.log('Todo creation result type:', typeof result);
      console.log('Todo creation result keys:', Object.keys(result));

      if ('data' in result) {
        console.log('Result has data:', result.data);
        if (result.data && result.data.success) {
          console.log('Todo created successfully');
          
          // Add the new todo to Redux store immediately
          console.log('Backend returned todo data:', result.data.data);
          
          const newTodoForStore = {
            id: (result.data.data as any)?.id || Date.now().toString(),
            title: newTask.trim(),
            isDone: false,
            creatorId: userData.data.userId,
            eventId: eventid as string,
          };
          
          console.log('Adding new todo to store:', newTodoForStore);
          dispatch(addToToDoList(newTodoForStore));
          
          console.log('Current Redux todos state after dispatch:', todos);
          
          setNewTask('');
          setIsAddingTask(false);
          
          // Also refetch to ensure backend consistency
          console.log('Refetching todos for consistency...');
          refetchTodos().then((refetchResult) => {
            console.log('Refetch todos result:', refetchResult);
          });
        } else {
          console.log('Todo creation data exists but not successful:', result.data);
        }
      } else if ('error' in result) {
        console.error('Todo creation failed with error:', result.error);
        console.error('Error details:', JSON.stringify(result.error, null, 2));
      } else {
        console.log('Unexpected result format:', result);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleComplete = async (todoId: string, isCompleted: boolean) => {
    try {
      // Find the original todo in Redux state to get the correct ID
      const originalTodo = Array.isArray(rawTodosFromRedux) 
        ? rawTodosFromRedux.find((t: ToDoState) => String(t.id) === todoId)
        : null;
        
      if (originalTodo) {
        // Optimistically update the todo completion status
        dispatch(updateToDoList(String(originalTodo.id)));
      }
      
      await updateTodo({
        todoId,
        isCompleted: !isCompleted,
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      // Could revert optimistic update on error if needed
    }
  };

  const handleEditTodo = async (todoId: string) => {
    if (!editText.trim()) return;

    try {
      // Find the original todo in Redux state to get the correct ID
      const originalTodo = Array.isArray(rawTodosFromRedux) 
        ? rawTodosFromRedux.find((t: ToDoState) => String(t.id) === todoId)
        : null;
        
      if (originalTodo) {
        // Optimistically update the todo text
        dispatch(editToDoInList({ 
          id: String(originalTodo.id), 
          title: editText.trim() 
        }));
      }
      
      await updateTodo({
        todoId,
        task: editText.trim(),
      });
      
      setEditingTodo(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
      // Could revert optimistic update on error if needed
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      console.log('Deleting todo with ID:', todoId);
      
      // Find the original todo in Redux state to get the correct ID
      const originalTodo = Array.isArray(rawTodosFromRedux) 
        ? rawTodosFromRedux.find((t: ToDoState) => String(t.id) === todoId)
        : null;
      
      if (originalTodo) {
        console.log('Found original todo with ID:', originalTodo.id, 'Type:', typeof originalTodo.id);
        console.log('Dispatching deleteToDoFromList with ID:', String(originalTodo.id));
        // Optimistically remove from Redux store first using the original ID
        dispatch(deleteToDoFromList(String(originalTodo.id)));
        console.log('Dispatch completed');
      } else {
        console.error('Could not find original todo in Redux state with ID:', todoId);
        console.log('Available todos in Redux:', rawTodosFromRedux);
        return;
      }
      
      // Delete the todo
      const result = await deleteTodo(todoId);
      console.log('Delete todo result:', result);
      
      // Success - the optimistic deletion already removed it from Redux
      console.log('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      // If delete failed, we should revert the optimistic update
      // But for simplicity, we'll let the next refetch restore the state
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.todoId);
    setEditText(todo.task);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditText('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>{t.tasks.loadingTasks}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.tasks.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t.tasks.subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <FiClock className="w-4 h-4" />
          <span>
            {t.tasks.pendingCompleted
              .replace('{pending}', pendingTodos.length.toString())
              .replace('{completed}', completedTodos.length.toString())}
          </span>
        </div>
      </div>

      {/* Add New Task */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
        {!isAddingTask ? (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>{t.tasks.addNewTask}</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={t.tasks.enterTaskDescription}
              className="flex-1 px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              autoFocus
            />
            <button
              onClick={handleAddTask}
              disabled={!newTask.trim() || isCreating}
              className="flex items-center justify-center w-12 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
            >
              {isCreating ? (
                <FiLoader className="w-5 h-5 animate-spin" />
              ) : (
                <FiCheck className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => {
                setIsAddingTask(false);
                setNewTask('');
              }}
              className="flex items-center justify-center w-12 h-12 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FiCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.tasks.pendingTasks} ({pendingTodos.length})
            </h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {pendingTodos.map((todo, index) => (
                <motion.div
                  key={todo.todoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
                >
                  {editingTodo === todo.todoId ? (
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleEditTodo(todo.todoId)
                        }
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditTodo(todo.todoId)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <button
                          onClick={() =>
                            handleToggleComplete(todo.todoId, todo.isCompleted)
                          }
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        >
                          <FiCircle className="w-5 h-5" />
                        </button>
                        <span className="text-gray-900 dark:text-white flex-1">
                          {todo.task}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.todoId)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {pendingTodos.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t.tasks.noPendingTasks}</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.tasks.completedTasks} ({completedTodos.length})
            </h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {completedTodos.map((todo, index) => (
                <motion.div
                  key={todo.todoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() =>
                          handleToggleComplete(todo.todoId, todo.isCompleted)
                        }
                        className="p-2 text-green-600 dark:text-green-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 group"
                        title={t.tasks.markAsIncomplete}
                      >
                        <FiCheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                      <span className="text-gray-700 dark:text-gray-300 line-through flex-1">
                        {todo.task}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {t.tasks.completed}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {completedTodos.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiCheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t.tasks.noCompletedTasks}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      {todos.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.tasks.progressOverview}
            </h3>
            <span className="text-2xl font-bold text-blue-600">
              {Math.round((completedTodos.length / todos.length) * 100)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedTodos.length / todos.length) * 100}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>
              {t.tasks.tasksCompleted
                .replace('{completed}', completedTodos.length.toString())
                .replace('{total}', todos.length.toString())}
            </span>
            <span>
              {t.tasks.remaining.replace('{remaining}', pendingTodos.length.toString())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
