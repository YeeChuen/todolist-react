import { createSlice } from '@reduxjs/toolkit'

const todoSlice = createSlice({
    name: "todos",
    initialState: {
        loading: false,
        todolist: [],
    },
    reducers:{
        setTodos(state, action) {
          state.todolist = [...action.payload];
        },
        addTodo(state, action) {
          state.todolist = [action.payload, ...state.todolist];
        },
        removeTodo(state, action) {
            state.todolist = state.todolist.filter((item, index) => {
                return index !== action.payload;
            })
        },
        editTodo(state, action) {
            state.todolist = state.todolist.map((item) => {
                if (item.id === action.payload.id) {
                  return { ...item, content: action.payload.content };
                } else {
                  return item;
                }
              })
        }
        
      },
})

export const { setTodos, addTodo, removeTodo, editTodo} = todoSlice.actions

export default todoSlice.reducer