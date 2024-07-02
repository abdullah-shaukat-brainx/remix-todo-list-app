// app/routes/signup.jsx

import React from "react";
import {
  Form,
  useActionData,
  redirect,
  useNavigation,
  Link,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  isValidEmailFormat,
  isValidPasswordFormat,
} from "../Utils/validationServices";
import { CircularProgress } from "@mui/material";

const prisma = new PrismaClient();

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  if (!isValidEmailFormat(email)) {
    return json({ error: "Incorrect Email Format" }, { status: 400 });
  }

  if (!isValidPasswordFormat(password)) {
    return json(
      {
        error:
          "Incorrect Password Format, Ensure Min Length: 8, 1 Upper Case, Lower Case and Special Characters each.",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return json({ error: "User already exists" }, { status: 400 });
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return redirect("/login");
  } catch (error) {
    return json({ error: "User creation failed" }, { status: 500 });
  }
};

const Signup = () => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for an account
          </h2>
          <Form method="post" className="mt-8 space-y-6">
            {actionData?.error && (
              <div className="text-red-500 text-center">{actionData.error}</div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
            <div className="flex justify-center">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 underline font-semibold"
              >
                Click here if you already have an account
              </Link>
            </div>
          </Form>
        </div>
      </div>
    );
};

export default Signup;
