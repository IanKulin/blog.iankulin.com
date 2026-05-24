---
title: "React Expense Tracker App"
date: '2024-01-22'
slug: react-expense-tracker-app
aliases:
  - /2024/01/22/react-expense-tracker-app/
tags:
  - javascript
  - react
  - web-dev
  - webdev
---

I'm focused on React frontend skills these holidays, and [working through Mosh's React 18](https://codewithmosh.com/p/ultimate-react-part1) course. The exercise today (which I think I nailed, although I spent more than the recommended hour on) was a small app to track expenses. Like most of Mosh's exercises it was great because it exercised all the understandings up to that point - so it's a good starting React project. It used Zod for the form validation which is completely new to me, but looks great.

### The Specification

![](/images/screen-shot-2023-12-31-at-6.02.08-am.png)

This is an app for tracking expenses. Expenses can be in one of three _categories_, they also must have a _description_ and an _amount_. There's a form for entering a new expense with a submit button. The form fields are validated before the expense item is added.

Below the form for adding a new expense item is a list of expenses. Each one shows its description, amount and category. There is also a button to delete this expense. At the bottom of the list is a total for the expenses shown. The expenses shown in the list can be filtered by category with a drop down.

### Design Decisions

The first decision in an React app is "What are the components going to be?". Clearly the form at the top is a component (I called mine `AddForm`). The bottom section could be two - the filter and the list, but my style is to start with less components then seperate them out if they are getting complex so I considered the filtered list a single component called `ExpenseList`. In Mosh's solution, he did have these as separate components, arguing that the filter is likely to become more complex in future which is a sound argument, but too much premature optimisation for me.

### Code

With that decision made, we have enough to write the App.tsx. I also decided to persist the array of `Expense`s to local storage to make it a nicer demo app. So with that, the app component code looks like this:

```
import { useState, useEffect } from "react";import AddForm from "./AddForm";import { Expense } from "./types.ts";import ExpenseList from "./ExpenseList";import { v4 as uuidv4 } from "uuid";function App() {  const [expenses, setExpenses] = useState<Expense[]>(() => {    // Try to load expenses from local storage    const savedExpenses = localStorage.getItem('mosh-expense');    if (savedExpenses) {      return JSON.parse(savedExpenses);    } else {      // If there are no saved expenses, load the sample expenses      return loadSampleExpenses();    }  });  useEffect(() => {    // Save expenses to local storage whenever they change    localStorage.setItem('mosh-expense', JSON.stringify(expenses));  }, [expenses]);  return (    <>      <AddForm expenses={expenses} setExpenses={setExpenses} />      <hr />      <ExpenseList expenses={expenses} setExpenses={setExpenses} />    </>  );}export default App;
```

Because I've got my big boy TypeScript pants on, there's a types.ts file with the types defined since they are common across a number of components:

```
export interface Expense {  id: string;  description: string;  amount: number;  category: string;}// needed so we can validate the form without the id then// add it laterexport interface FormExpense {  description: string;  amount: number;  category: string;}export interface ExpenseProps {  expenses: Expense[];  setExpenses: (expenses: Expense[]) => void;}
```

The reason for the existence of `FormExpense` without the `id` field is that the interaction between Zod and React got very complicated if the `id` field existed - Zod was determined to validate it. If I left it out of the Zod schema it caused problems because the type and the schema didn't match, if I made it optional in the schema, it created type mismatch problems that were solvable with typecasting calisthenics but it was ugly and difficult to follow. In the end, I went with these two types and just added the `id` after validation.

I also made a decision in coding the two types (`FormExpense` and `Expense`) like this. I've made a small footgun for a future developer in that they might add a new Field to one of them, and neglect to add it to the other. I could have avoided that by extending one, like this:

```
export interface FormExpense {  description: string;  amount: number;  category: string;}export interface Expense extends FormExpense {  id: string;}
```

That solves that problem, but to my mind is not as clear - conceptually, `Expense` is the main thing here, and really `FormExpense` is a derivative of it - just with the id removed. The TypeScript language designers could have helped me out here with some syntax, but I forgive you [Anders](https://en.wikipedia.org/wiki/Anders_Hejlsberg) because of the good living I once made out of Delphi. In my alternative timeline TypeScript it could look like this:

```
export interface Expense {  description: string;  amount: number;  category: string;  id: string;}export interface FormExpense reduces Expense {  id: %removed;}
```

So, I don't love the duplication in the existing type definition, but it seemed like the lessor of two evils, the definitions are right next to each other, and we are working in TypeScript so the future developer will discover their mistake at the time they'll make it.

There's also a subtle design decision in the very simple `ExpenseProps` worth thinking about. Firstly, I like having the props here with the `Expense` definition, but mostly how simple they are. There's no `addExpense()`, `updateExpense()`, or `deleteExpense()`. That's because, to the extent they are needed, they are dealt with inside each component.

Components are already tightly bound to their data types, so we're not making that worse by having this code with the compnent, but it would be perfectly valid to argue that all the data manipulation for expenses should be in one place. That argument would be won for me the second I needed to duplicate any of it - for example if two different components needed to delete an expense. But as the app stands now, this is neater, so that's what I've gone with.

### Expenses List

The mechanism for the filter is that we have a local function that returns the filtered list based on the selected category which is a state variable of the `ExpensesList` component. That `selectedCategory` is updated from the onChange of the drop-down selector.

The JSX just builds a table by .`map`ping the filtered expenses. I don't love the table code - it looks clunky. When I came back to look at it there were still some refactoring opportunities in it. Let's have a look:

```
<table className="table-bordered">  <thead>    <tr>      <th>Description</th>      <th>Amount</th>      <th>Category</th>      <th></th>    </tr>  </thead>  <tbody>    {filteredExpenses.map((expense) => (      <tr key={expense.id}>        <td className="centred-td">{expense.description}</td>        <td style={{ textAlign: "right" }}>          $          {expense.amount.toLocaleString("en-US", {            minimumFractionDigits: 2,            maximumFractionDigits: 2,          })}        </td>        <td className="centred-td">{expense.category}</td>        <td className="centred-td">          <button            className="btn btn-outline-danger"            onClick={() => handleDelete(expense.id)}          >            Delete          </button>        </td>      </tr>    ))}  </tbody>  <tfoot>    <tr>      <td></td>      <td style={{ textAlign: "right", fontWeight: "bold" }}>        $        {filteredExpenses          .reduce((total, expense) => {            return total + expense.amount;          }, 0)          .toLocaleString("en-US", {            minimumFractionDigits: 2,            maximumFractionDigits: 2,          })}      </td>      <td colSpan={2}></td>    </tr>  </tfoot></table>
```

The first thing I'm noticing is the code to format the amounts to US currency. That's in there twice - once for each expense, and once for the total. We could write a function for that, but since we're in React-land, let's make it a component. Ideally we'd extract the user's local currency from the browser settings somehow, but I don't think that's possible. In a real app, I guess we'd let them set it in settings. For the moment, they'll just have to live in dollar land.

```
interface TDCurrencyProps {    children: number;    fontWeight?: string;  }function TDCurrency({children, fontWeight = "normal"}:TDCurrencyProps) {  return (    <td style={{ textAlign: "right", fontWeight: fontWeight }}>      $      {children.toLocaleString("en-US", {        minimumFractionDigits: 2,        maximumFractionDigits: 2,      })}    </td>  );}export default TDCurrency;
```

Now we're thinking React-ivly! The table looks better already. Also, since now the alignment for the number column is in its own component, the centred styling can be applied to all the `<td>`s so I can remove the class I had added for that:

```
<table className="table-bordered">  <thead>    <tr>      <th>Description</th>      <th>Amount</th>      <th>Category</th>      <th></th>    </tr>  </thead>  <tbody>    {filteredExpenses.map((expense) => (      <tr key={expense.id}>        <td>{expense.description}</td>        <TDCurrency>{expense.amount}</TDCurrency>        <td>{expense.category}</td>        <td>          <button            className="btn btn-outline-danger"            onClick={() => handleDelete(expense.id)}          >            Delete          </button>        </td>      </tr>    ))}  </tbody>  <tfoot>    <tr>      <td></td>      <TDCurrency fontWeight="bold">{filteredTotal}</TDCurrency>      <td colSpan={2}></td>    </tr>  </tfoot></table>
```

Much nicer. Would it be crazy to component-ise that delete button as well? Probably, but while we're on a roll, and this is starting to feel like fun.

I really feel I'm starting to get the benefits of React that we're paying for with the tooling complexity and larger bundle size.

```
interface TDDeleteButtonProps {  onClick: (id: string) => void;  id: string;}function TDDeleteButton({ onClick, id}: TDDeleteButtonProps) {  return (    <td>      <button        className="btn btn-outline-danger"        onClick={() => onClick(id)}      >        Delete      </button>    </td>  );};export default TDDeleteButton;
```

I'm much happier with the table now:

```
<table className="table-bordered">  <thead>    <tr>      <th>Description</th>      <th>Amount</th>      <th>Category</th>      <th></th>    </tr>  </thead>  <tbody>    {filteredExpenses.map((expense) => (      <tr key={expense.id}>        <td>{expense.description}</td>        <TDCurrency>{expense.amount}</TDCurrency>        <td>{expense.category}</td>        <TDDeleteButton onClick={handleDelete} id={expense.id}/>      </tr>    ))}  </tbody>  <tfoot>    <tr>      <td></td>      <TDCurrency fontWeight="bold">{filteredTotal}</TDCurrency>      <td colSpan={2}></td>    </tr>  </tfoot></table>
```

The selector at the top of the expense list, is, well, okay.

```
<div className="mb-3 category-selector">  <label htmlFor="category" className="form-label">    Category:{" "}  </label>  <select    id="category"    name="category"    className="form-control drop-down"    onChange={handleCategoryChange}  >    <option value="All">All</option>    <option value="Groceries">Groceries</option>    <option value="Utilities">Utilities</option>    <option value="Entertainment">Entertainment</option>  </select></div>
```

The specification only specified these three categories - Groceries, Utilities, and Entertainment. and I have them hard-coded here, and in the add form. In Mosh's version he's made them a enum which is definitely nicer and future-proof-ier for a very small increase in complexity.

### Mosh

I really enjoy Mosh's videos and courses. He generally puts the first hour of his [courses on Youtube](https://www.youtube.com/@programmingwithmosh), so you can try before you buy. He has a knack for anticipating the questions that occur to you as he's explaining something so you feel a sense of continually being slightly challenged, but never overwhelmed. Hard recommend if you are learning programming.
