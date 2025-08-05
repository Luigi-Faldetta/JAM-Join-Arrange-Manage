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
} from '../../services/JamDB';
import { setToDoList } from '../../reduxFiles/slices/toDos';
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
  const { eventid } = useParams();
  const dispatch = useAppDispatch();

  // Select and map Redux state to UI type
  const todos = useSelector((state: RootState) =>
    Array.isArray(state.toDoListReducer)
      ? state.toDoListReducer
          .filter((todo): todo is ToDoState => typeof todo.id === 'string')
          .map((todo) => ({
            todoId: todo.id!,
            task: todo.title,
            isCompleted: todo.isDone,
            createdAt: '', // Fill if available
            updatedAt: '', // Fill if available
          }))
      : []
  );

  const [newTask, setNewTask] = useState('');
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // API hooks
  const { data: todosData, isLoading } = useGetTodosQuery(eventid as string);
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  useEffect(() => {
    if (todosData?.data) {
      dispatch(setToDoList(todosData.data));
    }
  }, [todosData, dispatch]);

  const pendingTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  const handleAddTask = async () => {
    if (!newTask.trim() || isCreating) return;

    try {
      const result = await createTodo({
        eventId: eventid as string,
        task: newTask.trim(),
      });

      if ('data' in result && result.data.success) {
        setNewTask('');
        setIsAddingTask(false);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleComplete = async (todoId: string, isCompleted: boolean) => {
    try {
      await updateTodo({
        todoId,
        isCompleted: !isCompleted,
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEditTodo = async (todoId: string) => {
    if (!editText.trim()) return;

    try {
      await updateTodo({
        todoId,
        task: editText.trim(),
      });
      setEditingTodo(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
    } catch (error) {
      console.error('Error deleting todo:', error);
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
        <div className="flex items-center space-x-2 text-gray-600">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Tasks</h2>
          <p className="text-gray-600 mt-1">
            Organize and track tasks for your event
          </p>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FiClock className="w-4 h-4" />
          <span>
            {pendingTodos.length} pending, {completedTodos.length} completed
          </span>
        </div>
      </div>

      {/* Add New Task */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        {!isAddingTask ? (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add new task</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description..."
              className="flex-1 px-4 py-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl transition-all duration-200"
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
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Tasks ({pendingTodos.length})
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
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                >
                  {editingTodo === todo.todoId ? (
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleEditTodo(todo.todoId)
                        }
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditTodo(todo.todoId)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
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
                        <span className="text-gray-900 flex-1">
                          {todo.task}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.todoId)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
              <div className="text-center py-8 text-gray-500">
                <FiCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No pending tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Completed Tasks ({completedTodos.length})
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
                  className="bg-green-50 rounded-xl border border-green-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() =>
                          handleToggleComplete(todo.todoId, todo.isCompleted)
                        }
                        className="p-1 text-green-600 hover:text-gray-400 transition-colors duration-200"
                      >
                        <FiCheckCircle className="w-5 h-5" />
                      </button>
                      <span className="text-gray-700 line-through flex-1">
                        {todo.task}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteTodo(todo.todoId)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {completedTodos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiCheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No completed tasks yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      {todos.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Progress Overview
            </h3>
            <span className="text-2xl font-bold text-blue-600">
              {Math.round((completedTodos.length / todos.length) * 100)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedTodos.length / todos.length) * 100}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {completedTodos.length} of {todos.length} tasks completed
            </span>
            <span>{pendingTodos.length} remaining</span>
          </div>
        </div>
      )}
    </div>
  );
}
