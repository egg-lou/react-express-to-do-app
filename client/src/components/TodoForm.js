import React, { useState, useRef } from 'react';
import { addTask } from '../services/api';

const TodoForm = (props) => {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    // Add handleChange function to update input state
    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input) {
            return;
        }

        try {
            const response = await addTask(input);
            console.log(response);
            // Handle the response from the API as needed
        } catch (error) {
            console.error('Error adding task:', error);
        }

        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className='todo-form'>
            {props.edit ? (
                <>
                    <input
                        placeholder='Update your item'
                        value={input}
                        onChange={handleChange}
                        name='text'
                        ref={inputRef}
                        className='todo-input edit'
                    />
                    <button onClick={handleSubmit} className='todo-button edit'>
                        Update
                    </button>
                </>
            ) : (
                <>
                    <input
                        placeholder='Add a todo'
                        value={input}
                        onChange={handleChange}
                        name='text'
                        className='todo-input'
                        ref={inputRef}
                    />
                    <button type="submit" className='todo-button'>
                        Add todo
                    </button>
                </>
            )}
        </form>
    );
};

export default TodoForm;