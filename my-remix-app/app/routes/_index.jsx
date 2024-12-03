import { useNavigate, useNavigation } from "@remix-run/react";
import { CircularProgress } from "@mui/material";

export const meta = () => {
  return [
    { title: "Remix Todo App" },
    { name: "description", content: "Welcome to Remix Todo!" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  const goToSignup = () => {
    navigate("/signup");
  };

  const navigation = useNavigation();
  if (navigation.state != "idle")
    return (
      <div className="flex items-center justify-center h-screen text-xl text-blue-600">
        <CircularProgress />
      </div>
    );
  else
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
        <div className="container mx-auto p-8 text-center bg-white shadow-lg rounded-lg max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">
            Welcome to Remix Todo App
          </h2>
          <p className="text-gray-500 mb-8">
            Manage your tasks efficiently and effortlessly.
          </p>
          <div className="space-y-4">
            <button
              onClick={goToLogin}
              className="w-full bg-blue-500 text-white py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={goToSignup}
              className="w-full bg-green-500 text-white py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    );
}
