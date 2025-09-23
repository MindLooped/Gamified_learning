"use client";

import Image from "next/image";
import styles from "@/styles/Root.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("ecolearn_user");
    if (!userData) {
      router.push("/auth");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth");
    }
  }, [router]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("ecolearn_user");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/auth");
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${showMenu ? "overflow-hidden h-screen" : ""}`}>
      <nav className="relative">
        <div className="flex p-10 items-center justify-between font-bold">
          <div className="flex items-center gap-3">
            <Link href="/Home" className="flex items-center ">
              <Image
                src="/logo.png"
                alt="Logo"
                width={35}
                height={35}
                className="mr-[0.8px]"
              />
              <h1 className="text-xl">EcoLearn</h1>
            </Link>
          </div>

          <div
            className={`flex flex-col gap-1 transition-all ease-in-out duration-300 ${
              styles.menu
            } ${showMenu ? styles.click : ""}`}
            onClick={toggleMenu}
          >
            <div className={`w-8 h-1 bg-black ${styles.menuli}`}></div>
            <div className={`w-8 h-1 bg-black ${styles.menuli}`}></div>
            <div className={`w-8 h-1 bg-black ${styles.menuli}`}></div>
          </div>

          <div
            className={`flex gap-8 items-center ${styles.menubar} ${
              showMenu ? styles.click : ""
            }`}
          >
            <ul className="flex gap-5">
              <li>
                <Link href="/Imagen" className={`${styles.a}`}>
                  EcoVision
                </Link>
              </li>
              <li>
                <Link href="/QA" className={`${styles.a}`}>
                  EcoQ&A
                </Link>
              </li>
              <li>
                <Link href="/Chat" className={`${styles.a}`}>
                  EcoChat
                </Link>
              </li>
              <li>
                <Link href="/Rekog" className={`${styles.a}`}>
                  EcoRekog
                </Link>
              </li>
            </ul>
            <div className="flex items-center space-x-3">
              <span className="text-green-600 font-semibold text-sm">Hello, {user.username}!</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Logout
              </button>
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              <Link href="/Contact">Green Connect</Link>
            </button>
          </div>
        </div>
      </nav>
      {!showMenu ? children : ""}
    </div>
  );
}
