import React, { useEffect, useState } from "react";
import "./todolist.css";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../APIs/todoAPIs";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, editTodo, removeTodo, setTodos } from "../slice/TodolistRTK";

const Todolist = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
//   console.log(todos.todolist);

  // get Todos
  useEffect(() => {
    async function fetchData() {
      const data = await getTodos();
      // redux slice to fetch todos
      dispatch(setTodos(data.reverse()));
    }
    fetchData();
  }, []);

  const [input, setInput] = useState("");
//   const [todolist, setTodolist] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");

//   useEffect(() => {
//     async function fetchData() {
//       const data = await getTodos();
//       setTodolist(data.reverse());
//     }
//     fetchData();
//   }, []);

  const handleSubmit = async () => {
    if (!input) return;

    const newItem = {
      content: input,
    };
    try {
      const todoWithId = await createTodo(newItem);
    //   setTodolist([todoWithId, ...todolist]);
      setInput("");

      // Redux Slice to add Todo
      dispatch(addTodo(todoWithId));

    } catch (err) {
      alert("failed to create todo!");
    }
  };

  const handleDelete = async (indexToDelete) => {
    try {
      const id = todos.todolist[indexToDelete].id;
      await deleteTodo(id);
    //   setTodolist(
    //     todolist.filter((item, index) => {
    //       return index !== indexToDelete;
    //     })
    //   );

      // Redux Slice to delete Todo
      dispatch(removeTodo(indexToDelete));
    } catch (err) {
      alert("failed to delete todo!");
    }
  };

  const handleEdit = async (id) => {
    if (editId === null || editId !== id) {
      setEditId(id);
      const currContent = todos.todolist.find((item) => item.id === id).content;
      setEditInput(currContent);
    } else {
      if (!editInput) return;
      try {
        await updateTodo(id, { content: editInput });
        // setTodolist(
        //   todolist.map((item) => {
        //     if (item.id === id) {
        //       return { ...item, content: editInput };
        //     } else {
        //       //return { ...item };//non primitive
        //       return item;
        //     }
        //   })
        // );

        // Redux Slice to update Todo
        dispatch(editTodo({id: id, content: editInput}));

        setEditId(null);
        setEditInput("");
      } catch (err) {
        alert("failed to update todo!");
      }
    }
  };

  const handleDeleteAll = async () => {
    try {
      for (let i = 0; i < todos.todolist.length; i++) {
        const id = todos.todolist[i].id;
        await deleteTodo(id);
      }
    //   setTodolist([]);
      dispatch(setTodos([]));
    } catch (err) {
      alert("failed to delete todo!");
    }
  };

  return (
    <div className="todo-container">
      <div className="form-container">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button onClick={handleSubmit}>submit</button>

        <button onClick={handleDeleteAll}>Delete all</button>
      </div>

      <div className="list-container">
        <ul>
          {todos.todolist.map((item, index) => {
            const isEdit = item.id === editId;
            return (
              <li key={item.id}>
                {isEdit ? (
                  <input
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                  />
                ) : (
                  <span>{item.content}</span>
                )}
                <div className="todo-action">
                  <button onClick={() => handleEdit(item.id)}>
                    {editId === item.id ? "save" : "edit"}
                    {/* save */}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(index);
                    }}
                  >
                    delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Todolist;
