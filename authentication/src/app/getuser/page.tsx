"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function GetUser() {
  const [userData, setUserData] = useState<any[]>([]);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/sampledata");
        if (Array.isArray(response.data.list)) {
          setUserData(response.data.list);
          setShowDownload(true);
        } else {
          toast.error("Unexpected response format");
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "user_data.xlsx");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Hello, this is GetUser page</h1>

      {showDownload && (
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
        >
          Download Excel
        </button>
      )}

      <ul className="bg-white p-4 rounded shadow w-1/2">
        {userData.map((user) => (
          <li key={user._id} className="border-b py-2">
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
