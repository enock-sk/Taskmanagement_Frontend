import Link from "next/link";

/**
 * Home page with links to signup and login.
 * @returns {JSX.Element} The rendered home component.
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-md p-4 text-center">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">
        Task Management App
      </h1>
      <Link
        href="/signup"
        className="block p-2 bg-blue-500 text-white rounded mb-2 hover:bg-blue-600"
      >
        Sign Up
      </Link>
      <Link
        href="/login"
        className="block p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </Link>
    </div>
  );
}
