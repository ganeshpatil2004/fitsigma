import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCog, CreditCard,
  CalendarCheck, BarChart2, ClipboardList, History,
} from "lucide-react";

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
    <div className="w-40 bg-white text-gray-700 fixed top-0 left-0 h-screen flex flex-col border-r border-gray-200 shadow-sm">

      {/* Logo */}
      <div className="px-3 py-4 flex-shrink-0 border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900">GymDesk</h1>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto py-2 px-1.5">
        <ul className="flex flex-col gap-0.5">
          {menu.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={i}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <Icon size={15} className="flex-shrink-0" />
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