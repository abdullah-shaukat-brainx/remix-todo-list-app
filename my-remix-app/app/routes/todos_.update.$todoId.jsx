import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
  useNavigation,
} from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { CircularProgress } from "@mui/material";

const prisma = new PrismaClient();

export const loader = async ({ params }) => {
  const todoId = params.todoId;
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new Response("Todo with entered ID not found", { status: 404 });
    }
    return json({ todo });
  } catch (error) {
    throw new Error(`Error fetching todo: ${error.message}`);
  }
};

export const action = async ({ request, params }) => {
  const todoId = params.todoId;
  const formData = await request.formData();
  const todoText = formData.get("text");

  if (todoText.trim() === "") {
    return json({ error: "Todo title cannot be empty" }, { status: 400 });
  }

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { text: todoText },
    });

    return redirect("/todos");
  } catch (error) {
    throw new Error(`Error updating todo: ${error.message}`);
  }
};

export default function UpdateTodo() {
  const { todo } = useLoaderData();
  const actionData = useActionData();
  const params = useParams();

  const navigation = useNavigation();
  if (navigation.state != "idle")
    return (
      <div className="flex items-center justify-center h-screen text-xl text-blue-600">
        <CircularProgress />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Update Todo {params.todoId}
      </h2>
      <Form method="post" className="mb-6">
        <input
          type="text"
          name="text"
          defaultValue={todo.text}
          placeholder="Enter new text"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        {actionData?.error && (
          <p className="text-red-500 mb-4">{actionData.error}</p>
        )}
        {actionData?.success && (
          <p className="text-green-500 mb-4">{actionData.success}</p>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Todo
        </button>
      </Form>
    </div>
  );
}
