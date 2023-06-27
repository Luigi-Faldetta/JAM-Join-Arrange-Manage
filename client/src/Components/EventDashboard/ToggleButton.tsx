
import React, { useState } from 'react';
import Todos from './Todos';
import Expenses from './Expenses';
import Attendees from './Attendees';

export default function ToggleButton() {
  const [showTodos, setShowTodos] = useState(true);

  const handleToggle = () => {
    setShowTodos((prevShowTodos) => !prevShowTodos);
  };

  return (
    <div>
      <button onClick={handleToggle} className='absolute top-20 right-20 btn btn-primary'>
        {showTodos ? 'Expenses' : 'Todos'}
      </button>
      {showTodos ? <> <Todos /> < Attendees /> </>  : <Expenses />}
    </div>
  );
}
