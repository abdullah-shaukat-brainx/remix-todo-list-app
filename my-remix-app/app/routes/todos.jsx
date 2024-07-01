import React from "react";
import { useNavigate, useLoaderData, Form } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loader = async () => {
  const todos = await prisma.todo.findMany(); // Fetch todos from the database

  return { todos };
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  try {
    await prisma.todo.delete({
      where: { id: id },
    });
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default function Todos() {
  const { todos } = useLoaderData(); // Fetch data from server
  const navigate = useNavigate();

  const handleTodoAddition = () => {
    navigate("/todos/create");
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <button
          onClick={handleTodoAddition}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Click me to Create a new Todo
        </button>

        <h1 className="text-2xl font-bold mb-4 mt-4">Todos</h1>
        {todos.length > 0 ? (
          <ul className="list-disc list-inside">
            {todos.map((todo) => (
              <li key={todo.id} className="text-lg mb-2 flex items-center">
                <span className="font-semibold">{todo.id}:</span>
                <span className="ml-2 flex-grow">{todo.text}</span>
                <button
                  onClick={() => navigate(`/todos/update/${todo.id}`)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  Update
                </button>
                <Form method="post">
                  <input type="hidden" name="id" value={todo.id} />
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                </Form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg mb-2">No todos available</p>
        )}
      </div>
    </>
  );
}
