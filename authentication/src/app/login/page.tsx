"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function login() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/login", user);

      // ✅ Handle success
      if (response.status === 200) {
        toast.success("Login Successful");
        router.push("/profile");
      }
    } catch (error: any) {
      // ✅ Handle error and extract status code
      const status = error?.response?.status;
      const message = error?.response?.data?.error || "Something went wrong";

      console.error("Login error:", status, message);

      if (status === 400) {
        toast.error("User not found");
      } else if (status === 401) {
        toast.error("Invalid password");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <>
      <div className="grid place-items-center h-screen">
        <div
          className="flex
         flex-col text-center bg-gray-500 rounded-3xl p-4 items-center px-6"
        >
          <h1 className="text-3xl font-bold text-blue-500 italic p-2">
            {loading ? "working..." : "Login Page"}
          </h1>

          <label
            htmlFor="email"
            className="text-white
          font-bold p-2 text-2xl"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
            className="rounded-2xl bg-white text-center focus:placeholder-transparent mb-4"
          />

          <label
            htmlFor="password"
            className="text-white
          font-bold p-2 text-2xl"
          >
            Password
          </label>
          <input
            type="text"
            id="password"
            placeholder="Enter Password"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
            className="rounded-2xl bg-white text-center  focus:placeholder-transparent mb-4"
          />

          <button
            className="border border-white text-center text-white font-bold rounded-2xl p-2 w-1/2"
            onClick={onLogin}
          >
            login
          </button>

          <Link href="/signup" className="text-blue-300 italic mt-2">
            Visit SignUp Page
          </Link>
        </div>
      </div>
    </>
  );
}
