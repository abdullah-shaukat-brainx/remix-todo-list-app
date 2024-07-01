import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import React, { useState } from "react";

const prisma = new PrismaClient(); // Instantiate PrismaClient

// Action to handle form submission
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
  };

  const navigation = useNavigation();
  if (navigation.state != "idle")
    return (
      <div className="flex items-center justify-center h-screen text-xl text-blue-600">
        Loading... Wait for a few moments
      </div>
    );
  else
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Create a New Todo</h2>
        <Form method="post" className="mb-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            placeholder="Enter a new todo"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            disabled={isSubmitting} // Disable the input while submitting
          />
          {actionData?.error && (
            <p className="text-red-500 mb-4">{actionData.error}</p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                <span className="ml-1">Submitting...</span>
              </>
            ) : (
              "Add Todo"
            )}
          </button>
        </Form>
      </div>
    );
}
