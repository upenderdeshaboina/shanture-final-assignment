import React, { Component } from 'react';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './App.css';

class App extends Component {
  state = {
    todosArray: [],
    name: '',
  };

  componentDidMount() {
    this.getTodo();
  }

  getTodo = async () => {
    const url = 'https://shanture-assignment.onrender.com/tasks';
    try {
      const response = await fetch(url);
      const responseData = await response.json();
      if (response.ok) {
        this.setState({ todosArray: responseData });
      } else {
        console.log('Error fetching todos');
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  addTodo = async (event) => {
    event.preventDefault();
    const { name } = this.state;
    const url = 'https://shanture-assignment.onrender.com/tasks';
    const data = { description: name, completed: 0 };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        this.setState({ name: '' }, this.getTodo);
      } else {
        console.log('Error adding todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  onchangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  deleteTodo = async (id) => {
    const url = `https://shanture-assignment.onrender.com/tasks/${id}`;
    const options = {
      method: 'DELETE',
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        this.getTodo();
      } else {
        console.log('Error deleting todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  toggleCompleted = async (id, completed) => {
    const url = `https://shanture-assignment.onrender.com/tasks/${id}`;
    const data = { completed: completed === 1 ? 0 : 1 };
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        this.getTodo();
      } else {
        console.log('Error updating todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  downloadPDF = () => {
    const { todosArray } = this.state;
    const doc = new jsPDF();

    doc.text('Todo List', 20, 10);
    doc.autoTable({
      head: [['Description', 'Completed']],
      body: todosArray.map(todo => [todo.description, todo.completed === 1 ? 'Yes' : 'No']),
    });

    doc.save('todos.pdf');
  };

  render() {
    const { todosArray, name } = this.state;
    return (
      <div className='main-container'>
        <div className='logo-container'>
          <img
            src='https://media.licdn.com/dms/image/D560BAQHBSZ1Apw7WrQ/company-logo_200_200/0/1707289640489/shanture_logo?e=2147483647&v=beta&t=1n2hkowSufjEAGzBQLyMCLVtJcLr7RSf7dMKwZs57Ow'
            alt='logo'
            className='main-logo'
          />
        </div>
        <form className='input-container' onSubmit={this.addTodo}>
          <input
            className='input'
            type='text'
            value={name}
            onChange={this.onchangeName}
            placeholder='Enter todo description'
          />
          <button className='add-btn' type='submit'>
            Add Todo
          </button>
        </form>
        
        <ul className='list-container'>
          {todosArray.map((todo) => (
            <li key={todo.id} className='li'>
              <div className='todo'>
                <input
                  type='checkbox'
                  className='checkbox'
                  checked={todo.completed === 1}
                  onChange={() => this.toggleCompleted(todo.id, todo.completed)}
                />
                <p className={`todo-description ${todo.completed === 1 ? 'completed' : ''}`}>
                  {todo.description}
                </p>
                <button className='delete-btn' type='button' onClick={() => this.deleteTodo(todo.id)}>
                  <MdOutlineDeleteOutline size={25} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button className='download-btn' onClick={this.downloadPDF} type='button'>
          Download PDF
        </button>
      </div>
    );
  }
}

export default App;
