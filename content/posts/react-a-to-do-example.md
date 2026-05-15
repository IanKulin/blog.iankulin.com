---
title: "React - a To Do Example"
date: '2024-01-08'
slug: react-a-to-do-example
aliases:
  - /2024/01/08/react-a-to-do-example/
tags:
  - possibly-useful
  - react
  - vite
  - web-dev
  - webdev
---

![](/images/crake_react_framework_logo_in_a_stylized_and_minimalist_ink-sta_cd004169-cd3c-4f76-8314-3d841f7233ec.jpg)

Since I'm on a roll making different versions of the To Do app, this might be a good time to talk about [React](https://react.dev/). React is one of the giants of front end libraries. It's based on a few big ideas - and to work effectively in React you need to wrap your head around these.

### Overview

Components - when you are developing in React, the starting point of your build is to decompose the user interface in to logical pieces. These components (comprising a mixture of HTML and Javascript) will be the building blocks of your app. In a good composable architecture components are reusable, and that is true for React (there are several sources of components you can pull in). For example, if you created some sort of special slider for your app, it is possible to reuse that quite easily.

Declarative - this was one of the big barriers when I was learning SwiftUI. The UI is just described. It's not a big step when you're coming from HTML - all that is is a description of the user interface. The next step of this is that React deals with using the state of your data model to update the UI. This means that these state-UI connections are made very explicit (which I like) and protected. For example if there's a counter on a web page, you can't change the HTML of the page to increment the counter, and in fact, you can't directly change the counter. These things are wrapped up so React can manage them, and you have to play by React's rules.

Virtual DOM - since each component knows what state it depends upon, and changing that state causes the component to be redrawn, it quickly gets expensive with parts of the page being reloaded. To improve performance, and reduce often unneeded flashes of content loading, React keeps a copy of the DOM and makes changes to it rather than the real DOM. Since this is instrumented, React can easily see what changes _really_ need to be percolated to the browser DOM and can manage how that happens in the most efficient way. Sometimes I think I know what I want to happen for something to be efficient but in React, it's often not in your control, and you just need to trust the system.

### Tooling

We're leaving my comfort zone of straightforward development environments, along with the major benefit of working in Javascript. The complexity of the React system requires a build step to produce the production artifacts. Whether you use the standard [Create-React](https://create-react-app.dev/), or [Vite](https://vitejs.dev/) (as I did for this project) you get a system for bundling the code, mapping it (since for debugging you need a way to translate the source line that's running back to the human readable source), and a development server to run the app while you're working on it.

These things inevitably add to complexity and errors, and are the reason that big projects start to need tools like development containers to remove a pain point. Like anything, you get better with experience, but especially at the start there's a developer cost involved. React is incredibly popular, so most people's calculus on this is that the extra complexity in project management is made up for with improved developer experience.

In any case, I got started by typing `npm create vite@latest .` and then choosing React and Javascript. This created a starter project, and spun it up in the development server. In the `package.json` file it gives you, there is a build command that can be run with `npm run build` to create the output files. I had issues with the development server that serves up these frontend files - since I also needed to run a real server (the unchanged REST API server for Todo Items data from the earlier project) on a different port. Then it complained - thinking it was part of a cross-site scripting hack. To overcome it, I just built the production code for each round of testing - with such a little project this wasn't a hardship. But when I did have an error to track, it pointed me to a line number that turned out to be about 20 pages of minified code.

### Components

![](/images/screen-shot-2023-12-22-at-7.47.24-am.png)

Just a little reminder of how this app looks so we can think about how we're going to break it down. There is a list of todo items, each one has a button to delete it (which we do when it has been completed) then at the bottom there's a little form to add a new item (by clicking the button or hitting enter) to the bottom of the list.

I ended up with three components - the App (every React app has one), the TodoList, and the AddTodoForm. Note that I could easily have had a forth component - the TodoItem. This is a bit of matter of taste - I probably would have if I wanted to do something fancier like editing in place - but for the current UX the cost of extracting out another component wasn't worth the benefit.

### Anatomy of a component

I claimed earlier that a component was it's HTML and Javascript wrapped up together which, while a massive simpliciation, is a good place to start thinking about it. Every component is just a function that returns a bunch of (templated) HTML. We'll start off by developing our AddTodoForm. At it's simplest, it could be something like this:

```
function AddTodoForm() {    return (        <form>            <input                type="text"                name="todo_item"                id="todo"                required            />            <button type="submit">Add</button>        </form>    );}export default AddTodoForm;
```

But this little form component can't really talk to the world, where as we need it to add a todo item. First, let's track any changes to the text field.

```
import { useState } from 'react';function AddTodoForm(props) {    const [value, setValue] = useState('');    return (        <form onSubmit={handleSubmit}>            <input                type="text"                name="todo_item"                id="todo"                value={value}                onChange={e => setValue(e.target.value)}                required            />            <button type="submit">Add</button>        </form>    );}export default AddTodoForm;
```

This is an example of the very explicit management of state I was talking about earlier.

`const [value, setValue] = useState('');`

useState() is a React hook for managing state. This line gives us a getter (value) and setter (setValue) for this variable, and set's its initial state to ''. If the value changes the component will be redrawn. React will know that the value has changed as this is built into the setValue() function where we never need see or worry about it. If you foolishly decided to side-step React and assign directly to `value`, I guess there'd be a runtime error, or even worse, no error and the management of the DOM state wuld fall into some type of chaos.

What we're doing with this value (which I'm now realising is very badly named) is using it to collect the text input from out form. It's constantly updated as the user types.

onChange={e => setValue(e.target.value)}

So that's our value sorted, but of course we need to add it to our data model. This model is being managed at the App level so there's a bit of juggling needed to get it out to there. This 'plumbing' cost is the downside of these types or framework, but it's not really complex and quickly becomes routine.

We'll start at the top, here's the relevant code from App.jsx - our App component.

```
 const [todos, setTodos] = useState([]);  const addTodo = (newTodo) => {    fetch('http://localhost:3000/todos', {      method: 'POST',      headers: {        'Content-Type': 'application/json',      },      body: JSON.stringify(newTodo),    })      .then(response => response.json())      .then(data => {        // Update the todos state with the new todo        setTodos([...todos, data]);      });  };
```

This useState hook should be starting to look familiar. We read the todos from `todos`, and write to them with `setTodos()`

`addTodo` does the actual work of saving it to the database (via our REST API) then creates a new `todos` array by adding our new one to the end. But we need to pass this down into our AddTodoForm. Here's the main part of the App that returns out HTML, in this case that's the list of todos and our form:

```
  return (    <main>      <h1>To do</h1>      <TodoList todos={todos} onDeleteTodo={deleteTodo}/>      <AddTodoForm onAddTodo={addTodo} />    </main>  )
```

You can see here that the todos array and a function _deleteTodo_() are passed into the the TodoList component, and that our _addTodo()_ function is passed to the AddTodoForm.

In React, things like this that are passed into a component are passed as a single object variable called 'props' - short for properties. It seems crazy to me to be bundling them like this in a language in 2023 rather than passing them explicitly as separate variables. This lack or clarity about what's being passed into a component is doubtless one of the reasons TypeScript is such a common combo with React. It's certainly the first time I've felt the need of it.

There is a lighter partial solution to adding types to props so that the linter can call out any issues - this is the PropTypes library - once it's installed, we import it with `import PropTypes from 'prop-types';` then we can add a definition for the props at the bottom of the file. For our AddTodoForm, this would look like this:

```
AddTodoForm.propTypes = {    onAddTodo: PropTypes.func.isRequired,};
```

Now the linter will prevent us from using anything other than props.onAddToDo, and it will flag if it's being used as anything other than a function.

Anyway, the props are passed in and we can extract the function from it to use.

```
import { useState } from 'react';function AddTodoForm(props) {    const [value, setValue] = useState('');    const handleSubmit = (event) => {        event.preventDefault();        if (!value) return;        props.onAddTodo({ todo_item: value });        setValue('');    };    return (        <form onSubmit={handleSubmit}>            <input                type="text"                name="todo_item"                id="todo"                value={value}                onChange={e => setValue(e.target.value)}                required            />            <button type="submit">Add</button>        </form>    );}export default AddTodoForm;
```

The arrangement of elements in this file will start to become familiar - there's often some state at the top with the useState() hook, then a few handler functions, then our final return of the 'HTML'.

Our TodoList is a bit simpler in that it doesn't have any handlers, but a better illustration of using PropTypes since it has access to the global state of the todos.

```
import PropTypes from 'prop-types';function TodoList(props) {    return (        <ul>            {props.todos.map(todo => (                <li key={todo.id}>                    {todo.todo_item}                    <button onClick={() => props.onDeleteTodo(todo.id)}>                        Done                    </button>                </li>            ))}        </ul>    )}TodoList.propTypes = {    todos: PropTypes.array.isRequired,    onDeleteTodo: PropTypes.func.isRequired};export default TodoList;
```

### Conclusion

You would not sensibly reach for React for a project this size - the complexity of the tooling, and the fact that we're now shipping 150K of Javascript to do something we were nicely achieving in 2K of vanilla, or 15K with htmx makes me deeply uncomfortable. Nevertheless, hundreds of thousands of developers can't be wrong - React's component model is a powerful one for building modern single page applications, especially when it allows you to pull in components from public or corporate collections.

I plan on doing some more React - partly because its just such big part of the webdev world, and partly because I'd like to get some experience with TypeScript, so I'm fishing around for a medium size project to play with both of these technologies.

([source](https://github.com/IanKulin/todo/tree/react))
