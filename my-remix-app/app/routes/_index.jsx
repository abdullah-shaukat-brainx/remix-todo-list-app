import { useNavigate } from "@remix-run/react";
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

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold">Home Page of Remix Todo!</h1>
      <button
        type="submit"
        className="bg-yellow-500 text-dark px-2 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        onClick={seeTodos}
      >
        See my Todos
      </button>
    </div>
  );
}
