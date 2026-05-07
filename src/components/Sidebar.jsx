import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCog, CreditCard,
  CalendarCheck, BarChart2, ClipboardList, History,
} from "lucide-react";

export const SIDEBAR_WIDTH = 340;

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard",     path: "/dashboard",     icon: LayoutDashboard },
    { name: "Customer",      path: "/customer",      icon: Users },
    { name: "Trainer",       path: "/trainer",       icon: UserCog },
    { name: "Payment",       path: "/payment",       icon: CreditCard },
    { name: "Attendence",    path: "/attendance",    icon: CalendarCheck },
    { name: "Report",        path: "/report",        icon: BarChart2 },
    { name: "Gym Enquiries", path: "/gym-enquiries", icon: ClipboardList },
    { name: "History",       path: "/history",       icon: History },
  ];

  return (
    <div
      style={{ width: `${SIDEBAR_WIDTH}px`, minWidth: `${SIDEBAR_WIDTH}px` }}
      className="bg-white text-gray-700 fixed top-0 left-0 h-screen flex flex-col border-r border-gray-200"
    >
      {/* Logo */}
      <div className="px-8 py-7 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">GymDesk</h1>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-2 px-4">
        <ul className="flex flex-col gap-1">
          {menu.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={i}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-5 px-5 py-4 rounded-xl text-base font-medium transition-colors
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <Icon size={24} className="flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;