import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store";
import { rederPending, rederTodos } from "./use-cases";

const ElementIDs = {
  TodoList: ".todo-list",
  NewTodoInput: "#new-todo-input",
  ClearCompletedButton: ".clear-completed",
  Todofilters: ".filtro",
  PendingCountLabel: '#pending-count'
};

/**
 *
 * @param {String} elementId
 */

export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    rederTodos(ElementIDs.TodoList, todos);
    updatePendingCount();
  };

  const updatePendingCount = () => {
    rederPending(ElementIDs.PendingCountLabel);
  }

  // Cuando la función App() se llama (o inicializa)
  (() => {
    const app = document.createElement("div");
    app.innerHTML = html;

    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  // Referencias HTML
  const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
  const todoListUL = document.querySelector(ElementIDs.TodoList);
  const clearCompletedButtom = document.querySelector(
    ElementIDs.ClearCompletedButton
  );
  const filtersLis = document.querySelectorAll(ElementIDs.Todofilters);

  // Listeners
  newDescriptionInput.addEventListener("keyup", (event) => {
    if (event.keyCode !== 13) return;

    if (event.target.value.trim().length === 0) return;

    todoStore.addTodo(event.target.value);
    displayTodos();

    event.target.value = "";
  });

  todoListUL.addEventListener("click", (event) => {
    const element = event.target.closest("[data-id]");
    todoStore.toggleTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  todoListUL.addEventListener("click", (event) => {
    const isDestroyElement = event.target.className === "destroy";
    const element = event.target.closest("[data-id]");
    if (!element || !isDestroyElement) return;
    todoStore.deleteTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  clearCompletedButtom.addEventListener("click", () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  filtersLis.forEach((element) => {
    element.addEventListener("click", (event) => {
      filtersLis.forEach((ev) => ev.classList.remove("selected"));
      event.target.classList.add("selected");

      switch (event.target.text) {
        case "Todos":
          todoStore.setFilter(Filters.All);
          break;
        case "Pendientes":
          todoStore.setFilter(Filters.Pending);
          break;
        case "Completados":
          todoStore.setFilter(Filters.Completed);
          break;
      }

      displayTodos();
    });
  });
};
