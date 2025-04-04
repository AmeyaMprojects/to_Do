import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import useDarkMode from "./useDarkMode"; // Import the custom hook
import { FaMoon, FaSun, FaTrash } from "react-icons/fa";

// Styled Components for Minimalist Design
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${(props) => (props.$isDark ? "#121212" : "#fff")};
  color: ${(props) => (props.$isDark ? "#fff" : "#000")};
  font-family: "Arial", sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${(props) => (props.$isDark ? "#fff" : "#000")};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TaskInput = styled.input`
  padding: 10px;
  border: 1px solid ${(props) => (props.$isDark ? "#fff" : "#000")};
  border-radius: 5px;
  font-size: 1rem;
  flex: 1;
  background-color: transparent;
  color: ${(props) => (props.$isDark ? "#fff" : "#000")};

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$isDark ? "#fff" : "#000")};
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.$isDark ? "#fff" : "#000")};
  color: ${(props) => (props.$isDark ? "#000" : "#fff")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${(props) => (props.$isDark ? "#ddd" : "#333")};
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 400px;
`;

const TaskItem = styled(motion.li)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.$isDark ? "#1e1e1e" : "#f9f9f9")};
  border: 1px solid ${(props) => (props.$isDark ? "#fff" : "#000")};
  border-radius: 5px;
  font-size: 1rem;
  color: ${(props) => (props.$isDark ? "#fff" : "#000")};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$isDark ? "#fff" : "#000")};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: red;
  }
`;

const DarkModeToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => (props.$isDark ? "#fff" : "#000")};
`;

// Animation Variants for Ink Effect
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 },
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isDarkMode, toggleDarkMode] = useDarkMode(); // Use the custom hook

  // Load tasks from local storage on mount
  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("tasks"));
      console.log("Raw data from localStorage:", savedTasks); // Log raw data
      if (Array.isArray(savedTasks)) {
        console.log("Valid tasks found. Setting tasks state:", savedTasks);
        setTasks(savedTasks);
      } else {
        console.warn("No valid tasks found in localStorage. Initializing with empty array.");
        setTasks([]); // Initialize with an empty array
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      setTasks([]); // Fallback to an empty array
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    console.log("Saving tasks to localStorage:", tasks); // Debugging
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  const handleAddTask = () => {
    if (inputValue.trim() === "") return;
    const newTask = {
      id: Date.now(), // Unique ID based on timestamp
      text: inputValue.trim(),
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setInputValue("");
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  };

  // Toggle Task Completion
  const handleToggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <AppContainer $isDark={isDarkMode}>
      <Header $isDark={isDarkMode}>Minimalist To-Do</Header>
      <DarkModeToggle
        $isDark={isDarkMode}
        onClick={toggleDarkMode}
        title="Toggle Dark Mode"
      >
        {isDarkMode ? <FaMoon /> : <FaSun />}
      </DarkModeToggle>
      <InputContainer>
        <TaskInput
          type="text"
          placeholder="Add a task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
          $isDark={isDarkMode}
        />
        <AddButton onClick={handleAddTask} $isDark={isDarkMode}>
          Add
        </AddButton>
      </InputContainer>
      <TaskList>
        <AnimatePresence>
          {tasks
            .sort((a, b) => a.completed - b.completed) // Sort tasks: incomplete first, completed last
            .map((task) => (
              <TaskItem
                key={task.id} // Use the unique ID
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout // Enable Framer Motion layout animations
                $isDark={isDarkMode}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTaskCompletion(task.id)}
                    style={{
                      marginRight: "10px",
                      accentColor: isDarkMode ? "#fff" : "#000",
                    }}
                  />
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? (isDarkMode ? "#aaa" : "#888") : "inherit",
                    }}
                  >
                    {task.text}
                  </span>
                </div>
                <DeleteButton
                  onClick={() => handleDeleteTask(task.id)}
                  $isDark={isDarkMode}
                >
                  <FaTrash />
                </DeleteButton>
              </TaskItem>
            ))}
        </AnimatePresence>
      </TaskList>
    </AppContainer>
  );
}