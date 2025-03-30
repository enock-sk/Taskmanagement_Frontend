"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { gql, useQuery, useMutation } from "@apollo/client";
import { z } from "zod";

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String, $status: String) {
    createTask(title: $title, description: $description, status: $status) {
      id
      title
      description
      status
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
    ) {
      id
      title
      description
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
});

/**
 * Task Management page for creating, updating, and deleting tasks.
 * @returns {JSX.Element} The rendered task management component.
 */
export default function TaskManagement() {
  const router = useRouter();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({
    text: "",
    type: null,
  });
  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleCreate = async () => {
    const result = taskSchema.safeParse(newTask);
    if (!result.success) {
      setMessage({ text: result.error.errors[0].message, type: "error" });
      return;
    }
    try {
      await createTask({ variables: newTask });
      setNewTask({ title: "", description: "", status: "pending" });
      setMessage({ text: "Task added successfully!", type: "success" });
      refetch();
      setTimeout(() => setMessage({ text: "", type: null }), 2000);
    } catch (error) {
      setMessage({ text: "Failed to add task. Please log in.", type: "error" });
    }
  };

  const handleUpdate = async (id: string, updates: Partial<typeof newTask>) => {
    try {
      await updateTask({ variables: { id, ...updates } });
      setMessage({ text: "Task updated successfully!", type: "success" });
      refetch();
      setTimeout(() => setMessage({ text: "", type: null }), 2000);
    } catch (error) {
      setMessage({ text: "Failed to update task.", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask({ variables: { id } });
      setMessage({ text: "Task deleted successfully!", type: "success" });
      refetch();
      setTimeout(() => setMessage({ text: "", type: null }), 2000);
    } catch (error) {
      setMessage({ text: "Failed to delete task.", type: "error" });
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-600">
        Error: Please log in to manage tasks.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight md:text-5xl">
              Manage Tasks
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Create, edit, or delete your tasks here.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-full shadow-md hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </header>
        {message.text && (
          <div
            className={`mb-6 p-3 rounded-lg text-center text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}
        <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Add New Task
          </h2>
          <div className="space-y-4">
            <input
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              placeholder="Task Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Description (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              rows={3}
            />
            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={handleCreate}
              className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
            >
              Add Task
            </button>
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data?.tasks.map((task: any) => (
            <div
              key={task.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              <input
                value={task.title}
                onChange={(e) =>
                  handleUpdate(task.id, { title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
              />
              <textarea
                value={task.description || ""}
                onChange={(e) =>
                  handleUpdate(task.id, { description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y mb-3"
                rows={2}
              />
              <select
                value={task.status}
                onChange={(e) =>
                  handleUpdate(task.id, { status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => handleDelete(task.id)}
                className="w-full p-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
              >
                Delete Task
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
