import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow-lg">
      <h1 className="text-xl font-bold">Monad NFT Swap</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-purple-400">Home</Link>
        <Link to="/swap" className="hover:text-purple-400">Swap</Link>
        <Link to="/confirm" className="hover:text-purple-400">Confirm</Link>
        <Link to="/connect" className="hover:text-purple-400">Connect</Link>
      </div>
    </nav>
  );
}
