import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, LayoutDashboard, MessageSquare, PlusSquare, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/landlord/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Properties', to: '/landlord/properties', icon: <Building2 size={18} /> },
  { label: 'Add Property', to: '/landlord/properties/new', icon: <PlusSquare size={18} /> },
  { label: 'Messages', to: '/messages', icon: <MessageSquare size={18} /> },
  { label: 'Settings', to: '/profile', icon: <Settings size={18} /> },
];

const Sidebar = () => (
  <>
    <aside className="dashboard-sidebar dashboard-sidebar--desktop">
      <div className="dashboard-sidebar__brand">
        <div className="dashboard-sidebar__logo">س</div>
        <div>
          <strong>Sakany</strong>
          <span>Landlord Console</span>
        </div>
      </div>

      <nav className="dashboard-sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `dashboard-sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="dashboard-sidebar__footer">
        <p>Premium listing workflow for hosts, owners, and operators.</p>
      </div>
    </aside>

    <nav className="dashboard-sidebar dashboard-sidebar--mobile">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `dashboard-sidebar__link ${isActive ? 'is-active' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </>
);

export default Sidebar;