"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FilePlus,
  List,
  BarChart2,
  PanelRightOpen,
  PanelLeftOpen,
  LayoutList,
  LogOut,
} from "lucide-react";
import { AllowOnlyAuth } from "../../components/AllowOnlyAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebaseconfig";

function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Sidebar states
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMinified, setIsMinified] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard size={14} />,
    },
    { name: "Add New", href: "/dashboard/publish", icon: <FilePlus size={14} /> },
    { name: "All Posts", href: "/dashboard/all-posts", icon: <LayoutList size={14} /> },
    // { name: "Reports", href: "/dashboard/reports", icon: <BarChart2 size={14} /> },
  ];


  function handleLogout() {
    signOut(auth).then(() => {
      router.push("/signin");
    }).catch((error) => {
      alert(error);
    });
  
  }
    

  // const bottomNav = [
  //   {
  //     name: "Logout",
  //     href: "/signin",
  //     icon: <LogOut size={14} />,
  //   },
  // ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 bg-white border-r transition-all duration-300 
          ${isMinified ? "w-16" : "w-64"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b h-14">
          {!isMinified && (
            <span className="text-xl font-bold text-black">
            <img className="h-12" src="/Logo_Synage_Colored_WithTagline.png" alt="" />
</span>
          )}

          {/* Minify toggle (desktop only) */}
          <button
            onClick={() => setIsMinified(!isMinified)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
          >
            {isMinified ? <PanelLeftOpen strokeWidth={"0.75px"} /> : <PanelRightOpen strokeWidth={"0.75px"} /> }
          </button>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 ">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-x-3 px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {!isMinified && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* BOTTOM NAV */}
        <nav className="flex-1 overflow-y-auto p-2 absolute bottom-0 w-full">
          <ul className="space-y-1">
            <button onClick={handleLogout} className="flex items-center justify-center bg-red-500 text-white gap-x-3 px-3 py-2 rounded-md transition-colors w-full">
              Logout
            </button>
            {/* {bottomNav.map((item) => (
              <li className="w-full" key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-x-3 px-3 py-2 rounded-md transition-colors w-full ${
                    pathname === item.href
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {!isMinified && <span>{item.name}</span>}
                </Link>
              </li>
            ))} */}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMinified ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Navbar */}
        <header className="fixed left-0 top-0 right-0 flex items-center justify-between px-6 py-4 bg-white border-b h-14 z-30
        ">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <div className="text-xl font-semibold ml-16">
            <img className="h-12" src="/Logo_Synage_Colored_WithTagline.png" alt="" />
</div>

          {/* <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Logout
          </button> */}
        </header>

        {/* Page Content */}
        <main className="px-6 py-16">{children}</main>
      </div>
    </div>
  );
}


export default AllowOnlyAuth(DashboardLayout);