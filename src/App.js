import React, { useMemo } from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, } from "framer-motion"; // Импорт Framer Motion
import './App.css';
import TodoItem from "./components/TodoItem";
import useLocalStorage from "./hooks/useLocalStrage";

function App() {

  //Использую хук вместо useState
  const [todos, setTodos] = useLocalStorage("todos", []);

  // Состояние для фильтрации задач: 'all', 'active' или 'completed'
  const [filter, setFilter] = useState('all');

  // Функция фильтрации задач по статусу
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': 
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default: 
        return todos;
    }
  }, [filter, todos]);

  // Состояние для значения input
  const [inputValue, setInputValue] = useState('');

  // Сохранение задач в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos)); // Преобразуем в строку
  }, [todos]); // Зависимость от состояния todos

 // Изменяем функцию addTodo - теперь задачи добавляются в начало
 const addTodo = useCallback(() => {
  if (inputValue.trim()) {
    setTodos([{ 
      text: inputValue,
      id: Date.now(),
      completed: false 
    }, ...todos]); // Добавляем в начало массива
    setInputValue('');
  }
}, [inputValue, todos, setTodos]);

  //adding 'submit' const via useCallback
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addTodo();
    }
  }, [inputValue, addTodo]);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  const toggleComplete = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? {...todo,completed: !todo.completed } : todo
    ));
  }, [setTodos]);

  const handleEditTodo = useCallback((id, newText) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? {...todo, text: newText} : todo
    ));
  }, [setTodos]);

  return (
    <div className="App">
      <motion.h1
        initial={{ opacity: 0, y: -20 }} // Начальное состояние
        animate={{ opacity: 1, y: 0 }} // Анимация появления
        transition={{ delay: 0.2 }} // Задержка анимации
      >
        kapanaki daily
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress} //listener for 'enter' submit
          placeholder="type your ask here to add"
        />
        <motion.button
          onClick={addTodo}
          disabled={!inputValue.trim()}
          whileHover={{ 
            background: 'black',
            color: 'white',
            scale: 1.05 
          }} // Эффект при наведении
          whileTap={{ scale: 0.95 }} // Эффект при нажатии
          style={{
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '9px 18px',
            marginLeft: '-9px',
            cursor: 'pointer'
          }}
        >
          add
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="filters"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          all tasks
        </motion.button>
        <motion.button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          active tasks
        </motion.button>
        <motion.button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          complete tasks
        </motion.button>    
      </motion.div>
      
      {/* Список задач с анимациями */}
      <ul>
        <AnimatePresence mode="popLayout">
          {filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              onDelete={deleteTodo}
              onToggle={toggleComplete}
              onEdit={handleEditTodo}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default App;