import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import React from "react";
import { CircularProgress } from "@mui/material";

const prisma = new PrismaClient();

export const action = async ({ request }) => {
  const formData = await request.formData();
  const todoText = formData.get("text");

  if (todoText.trim() === "") {
    return json({ error: "Todo text cannot be empty" }, { status: 400 });
  }

  try {
    await prisma.todo.create({
      data: {
        text: todoText,
        status: false,
      },
    });

    return redirect("/todos");
  } catch (error) {
    throw new Error(`Error creating todo: ${error.message}`);
  }
};

export default function CreateTodo() {
  const actionData = useActionData();

  const navigation = useNavigation();
  if (navigation.state != "idle")
    return (
      <div className="flex items-center justify-center h-screen text-xl text-blue-600">
        <CircularProgress />
      </div>
    );
  else
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Create a New Todo</h2>
        <Form method="post" className="mb-6">
          <input
            type="text"
            name="text"
            placeholder="Enter a new todo"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          {actionData?.error && (
            <p className="text-red-500 mb-4">{actionData.error}</p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Todo
          </button>
        </Form>
      </div>
    );
}
