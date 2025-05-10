import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/UI/Navbar";
import CardGrid from "@/components/UI/CardGrid";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-400 ">
      <Navbar />

      <CardGrid />
    </div>
  );
}
