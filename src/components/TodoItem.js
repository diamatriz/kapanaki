  import React, { useState, useCallback } from "react";
  import { motion } from "framer-motion";
  import { itemVariants } from "../animations/itemVariants";
  
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

  export default React.memo(TodoItem);