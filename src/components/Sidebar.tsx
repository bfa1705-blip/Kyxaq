'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const categories = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Images', href: '/dashboard/images', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-zinc-800 bg-[#0f0f0f] p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
          <span className="text-white font-bold text-lg italic">K</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">KxStudios</h2>
      </div>
      
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4 ml-2">Menu</p>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = pathname === cat.href;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon size={18} />
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-zinc-800">
        <button 
          onClick={() => {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
