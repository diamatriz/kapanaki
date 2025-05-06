import React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, } from "framer-motion"; // Импорт Framer Motion
import './App.css';

//animation settings
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1, //Custom appearing delay
        duration: 0.3,
        type: "spring",
        damping: 30,
        stiffness: 500
      }
    }),
    exit: { opacity: 0, x: 100 }
  };

  // Выносим TodoItem в отдельный компонент с React.memo для оптимизации
const TodoItem = React.memo(({ todo, onDelete, onToggle, onEdit, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [localCompleted, setLocalCompleted] = useState(todo.completed); // Локальное состояние для анимации

  // Сохранение изменённого текста
  const handleSave = useCallback(() => {
    if (editedText.trim()) {
      onEdit(todo.id, editedText);
    }
    setIsEditing(false);
  }, [editedText, onEdit, todo.id]);

  // Обработчик переключения статуса с анимацией
  const handleToggle = useCallback(() => {
    setLocalCompleted(!localCompleted); // Локальное изменение для анимации
    onToggle(todo.id); // Глобальное обновление состояния
  }, [localCompleted, onToggle, todo.id]);

  return (
    <motion.li
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isEditing ? '#f0f0f0' : 'transparent',
        padding: '8px',
        margin: '4px 0',
        borderRadius: '4px'
      }}
    >
      <motion.div
        style={{ flexGrow: 1 }}
        onDoubleClick={() => {
          setEditedText(todo.text);
          setIsEditing(true);
        }}
        whileHover={{ scale: 1.01 }}
      >  
        {isEditing ? (
          <motion.input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          />
        ) : (
          <motion.span 
            onClick={handleToggle}
            initial={false}
            animate={{
              textDecoration: localCompleted ? 'line-through' : 'none',
              color: localCompleted ? '#888' : '#000'
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            whileTap={{ scale: 0.98 }}
          >
            {todo.text}
          </motion.span>
        )}
      </motion.div>
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        style={{
          marginLeft: '10px',
          textDecoration: 'none',
          background: 'white',
          color: 'black',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
        whileHover={{
          background: 'black',
          color: "white",
          scale: 1.05 
        }}
        whileTap={{ scale: 0.95 }}
      >
        delete
      </motion.button>
    </motion.li>
  );
});


function App() {

  // Состояние для фильтрации задач: 'all', 'active' или 'completed'
  const [filter, setFilter] = useState('all');
  
  // Основное состояние задач с загрузкой из localStorage
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos'); // Получаем сохранённые задачи
    return savedTodos ? JSON.parse(savedTodos) : []; // Парсим или возвращаем пустой массив
  });

  
  // Состояние для значения input
  const [inputValue, setInputValue] = useState('');

  // Функция фильтрации задач по статусу
  const getFilteredTodos = () => {
    switch(filter) {
      case 'active': 
        return todos.filter(todo => !todo.completed); // Только активные задачи
      case 'completed': 
        return todos.filter(todo => todo.completed); // Только выполненные
      default: 
        return todos; // Все задачи
    }
  };

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
}, [inputValue, todos]);

  //adding 'submit' const via useCallback
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addTodo();
    }
  }, [inputValue, addTodo]);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? {...todo,completed: !todo.completed } : todo
    ));
  }, []);

  const handleEditTodo = useCallback((id, newText) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? {...todo, text: newText} : todo
    ));
  }, []);
 

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
          {getFilteredTodos().map((todo, index) => (
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