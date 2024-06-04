import React, { Component } from "react";
import "./todolist.css";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../APIs/todoAPIs";



export default class Todolist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      todolist: [],
      editId: null,
      editInput: null,
    };
  }

  async componentDidMount() {
    const data = await getTodos();
    console.log("data", data);
    this.setState({ todolist: data.reverse() });
  }

  handleSubmit = async () => {
    //1. create todo item object
    const newItem = {
      content: this.state.input,
    };
    //2. push to the todolist state
    try {
      const todoWithId = await createTodo(newItem);
      //this.state.todolist.push(newItem);//no mutation
      this.setState({
        todolist: [todoWithId, ...this.state.todolist],
      });
    } catch (err) {
      alert("failed to create todo!");
    }
  };

  handleDelete = async (indexToDelete) => {
    //splice
    //this.state.todolist.splice(index, 1); //
    try {
      const id = this.state.todolist[indexToDelete].id;
      await deleteTodo(id);
      this.setState({
        todolist: this.state.todolist.filter((item, index) => {
          return index !== indexToDelete;
        }),
      });
    } catch (err) {
      alert("failed to delete todo!");
    }
  };

  handleEdit = async (id) => {
    if (this.state.editId === null) {
      this.setState({
        editId: id,
        editInput: this.state.todolist.find((item) => item.id === id).content,
      });
    } else {
      //save
      //this.state.todolist.find(item=>item.id === id).content = this.state.editInput; //wrong, mutating
      /* const newState = { ...this.state }; //shallow copy
            newState.todolist.find((item) => item.id === id).content =
                this.state.editInput; */ //wrong: mutating nested object/array
      //object(data structure) => json(string)
      //const newState = JSON.parse(JSON.stringify(this.state)); //not recommended, JSON.stringify,
      //manual copy: create new reference for all nested non-primitive data
      //Array.map create new array

      /* 
            //correct:
            const newState = {
                ...this.state,
                todolist: this.todolist.map((item) => {
                    return { ...item };
                }),
            };
            newState.todolist.find((item) => item.id === id).content =
                this.state.editInput;
            this.setState(newState); */

      //break down component and state into smaller one
      try {
        await updateTodo(id, { content: this.state.editInput });
        this.setState({
          ...this.state,
          editId: null,
          editInput: null,
          todolist: this.state.todolist.map((item) => {
            if (item.id === id) {
              return { ...item, content: this.state.editInput };
            } else {
              //return { ...item };//non primitive
              return item;
            }
          }),
        });
      } catch (err) {
        alert("failed to update todo!");
      }
    }
  };
  //nested flexbox
  //flex: 1d layout system,
  render() {
    return (
      <div className="todo-container">
        <div className="form-container">
          <input
            value={this.state.input}
            onChange={(event) => {
              this.setState({ input: event.target.value });
            }}
          />
          <button onClick={this.handleSubmit}>submit</button>
        </div>

        <div className="list-container">
          <ul>
            {this.state.todolist.map((item, index) => {
              const isEdit = item.id === this.state.editId;
              return (
                <li key={item.id}>
                  {/* conditional rendering */}
                  {isEdit ? (
                    <input
                      value={this.state.editInput}
                      onChange={(e) =>
                        this.setState({
                          editInput: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{item.content}</span>
                  )}

                  {/* replace span */}
                  <div className="todo-action">
                    <button onClick={() => this.handleEdit(item.id)}>
                      {this.state.editId === item.id ? "save" : "edit"}
                      {/* save */}
                    </button>
                    <button
                      onClick={() => {
                        this.handleDelete(index);
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
  }
}