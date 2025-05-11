"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { log } from "console";

export default function profile() {
  const router = useRouter();
  const logout = async () => {
    try {
      const response = await axios("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log("error: ", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <h2>Welcome to Profile Page</h2>
      <hr />
      <button
        onClick={logout}
        className="bg-red-300 p-4 mt-4 rounded-2xl hover:bg-red-500"
      >
        LogOut
      </button>
    </div>
  );
}
