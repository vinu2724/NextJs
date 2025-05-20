"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

export default function signup() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("signup successfull", response.data);
      router.push("/login");
    } catch (error: any) {
      const statuscode = error?.response?.status;
      const message = error?.response?.data?.error || "Something went wrong";
      if (statuscode == 409) {
        toast.error("User already Exist");
        setUser({
          email: "",
          password: "",
          username: "",
        });
      } else {
        console.log("signup failed", error.message);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid place-items-center h-screen">
        <div
          className="flex
         flex-col text-center bg-gray-500 rounded-3xl p-4 items-center px-6 min-w-1/4"
        >
          <h1 className="text-3xl font-bold text-white italic p-2 border rounded-2xl ">
            {loading ? "Loading wait!" : "SignUp"}
          </h1>

          <label
            htmlFor="username"
            className="text-white
          font-bold p-2 text-2xl"
          >
            UserName
          </label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
            }}
            placeholder="Enter UserName"
            className="rounded-2xl bg-white text-center focus:placeholder-transparent mb-4 p-2 "
          />
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
            className="rounded-2xl bg-white text-center focus:placeholder-transparent mb-4 p-2"
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
            className="rounded-2xl bg-white text-center  focus:placeholder-transparent mb-4 p-2"
          />

          <button
            className={`border border-white text-center text-white font-bold rounded-2xl p-2 w-1/2 bg-blue-400 ${
              buttonDisabled ? "hover:bg-red-400" : "hover:bg-green-400"
            }`}
            onClick={onSignup}
          >
            {buttonDisabled ? "NO SignUp" : "SignUP"}
          </button>

          <Link href="/login" className="text-blue-300 italic mt-2">
            Visit Login
          </Link>
        </div>
      </div>
    </>
  );
}
