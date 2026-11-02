import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  User,
  HeartPulse,
  X,
} from "lucide-react";

import { useAuth } from "../../features/auth/context/AuthContext";
import { Button } from "../ui/button";

const navigation = {
  DOCTOR: [
    { label: "Overview", path: "/doctor/dashboard", icon: LayoutDashboard },
    { label: "My Slots", path: "/doctor/slots", icon: Calendar },
    {
      label: "Appointments",
      path: "/doctor/appointments",
      icon: CalendarCheck,
    },
    { label: "My Profile", path: "/doctor/profile", icon: User },
  ],
  PATIENT: [
    { label: "Overview", path: "/patient/dashboard", icon: LayoutDashboard },
    { label: "Find Doctors", path: "/patient/doctors", icon: User },
    {
      label: "My Appointments",
      path: "/patient/appointments",
      icon: CalendarCheck,
    },
    { label: "My Profile", path: "/patient/profile", icon: User },
  ],
  ADMIN: [
    { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
  ],
};

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ mobileOpen, onClose }: DashboardSidebarProps) => {
  const { session } = useAuth();

  if (!session) return null;

  const links = navigation[session.role];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          shrink-0 border-r border-sidebar-border
          bg-sidebar p-5
          transform transition-transform duration-200 ease-in-out
          md:static md:min-h-screen md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse size={21} />
            </div>
            <span className="text-xl font-bold tracking-tight">CarePoint</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        <nav className="space-y-1.5">
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <Icon size={19} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
