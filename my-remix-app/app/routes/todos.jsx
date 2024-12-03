import React from "react";
import {
  useNavigate,
  useLoaderData,
  Form,
  useNavigation,
  redirect,
} from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { CircularProgress } from "@mui/material";
import { fetchUserFromToken } from "../Utils/jwtServices";
const prisma = new PrismaClient();

export const loader = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      throw redirect("/login");
    }
    const token = cookieHeader.split("access-token=")[1];
    const decodedUser = fetchUserFromToken(token);
    if (decodedUser.exp < new Date() / 1000) {
      return new Response("Token expired", {
        status: 302,
        headers: {
          "Set-Cookie":
            "access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
          Location: "/login",
        },
      });
    }
    const todos = await prisma.todo.findMany({
      where: {
        user_id: decodedUser.userId,
      },
    });
    return { todos };
  } catch (error) {
    console.error("Error in loader function:", error);
    return { todos: [] };
  }
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

const Todos = () => {
  const { todos } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const handleLogout = () => {
    document.cookie =
      "access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    navigate("/login");
  };

  if (navigation.state !== "idle")
    return (
      <div className="flex items-center justify-center h-screen text-xl text-blue-600">
        <CircularProgress />
      </div>
    );
  else
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Logout
        </button>
        <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Todo List</h1>
          <button
            onClick={() => navigate("/todos/create")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
          >
            Add New Todo
          </button>
          {todos.length > 0 ? (
            <ul className="space-y-4">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-gray-200 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-grow">
                    <span className="text-lg font-semibold">{todo.text}</span>
                    <span className="text-sm text-gray-500">
                      {" "}
                      (ID: {todo.id})
                    </span>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => navigate(`/todos/update/${todo.id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 mr-2"
                    >
                      Update
                    </button>
                    <Form method="delete">
                      <input type="hidden" name="id" value={todo.id} />
                      <button
                        type="submit"
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No todos available</p>
          )}
        </div>
      </div>
    );
};

export default Todos;
