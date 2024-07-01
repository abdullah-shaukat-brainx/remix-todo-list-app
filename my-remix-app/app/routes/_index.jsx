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
