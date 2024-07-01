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
  const seeTodos = () => {
    navigate("/todos");
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
      <div className="flex flex-col">
        <div className="container mx-auto p-4 text-center">
          <h2 className="text-xl font-semibold mb-4">Home Page for my Todos</h2>
          <button
            onClick={seeTodos}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
          >
            See my Todos
          </button>
        </div>
      </div>
    );
}
