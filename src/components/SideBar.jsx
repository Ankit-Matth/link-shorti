'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Link as LinkIcon,
  DollarSign,
  Users,
  Percent,
  HelpCircle,
  Headset,
  Menu,
  ChevronLeft,
  Gem,
} from 'lucide-react';
import { useSession } from "next-auth/react";

const SidebarItem = ({ icon, text, active, expanded, onClick }) => (
  <li
    className={`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${
        active
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
          : 'hover:bg-indigo-50 text-gray-600'
      }
  `}
    onClick={onClick}
  >
    {icon}
    <span
      className={`overflow-hidden transition-all ${
        expanded ? 'w-52 ml-3' : 'w-0'
      }`}
    >
      {text}
    </span>
    {!expanded && (
      <div
        className={`
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
    `}
      >
        {text}
      </div>
    )}
  </li>
);

const SideBar = ({ activeContent, setActiveContent }) => {
  const [expanded, setExpanded] = useState(true);
  const { data: session } = useSession();

  const sidebarItems = [
    {
      icon: <BarChart3 size={20} />,
      text: 'Statistics',
      contentId: 'statistics',
    },
    {
      icon: <LinkIcon size={20} />,
      text: 'Manage Links',
      contentId: 'manage-links',
    },
    {
      icon: <DollarSign size={20} />,
      text: 'Withdrawal',
      contentId: 'withdrawal',
    },
    {
      icon: <Users size={20} />,
      text: 'Refferals',
      contentId: 'refferals',
    },
    {
      icon: <Percent size={20} />,
      text: 'Payout rates',
      path: '/payout-rates',
    },
    {
      icon: <HelpCircle size={20} />,
      text: 'Faqs',
      path: '/faqs',
    },
    {
      icon: <Headset size={20} />,
      text: 'Support',
      path: '/contact',
    },
  ];

  return (
    <aside className={`h-screen z-50 transition-all ${expanded ? 'w-80' : 'w-20'}`}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Link href="/" className={`${expanded ? 'flex' : 'hidden'} items-center gap-2 `}>
            <Gem size={20} className="text-cyan-400" />
            <span className="text-xl font-bold">
              LinkShorti
            </span>
          </Link>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronLeft /> : <Menu />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          {sidebarItems.map((item, index) => {
            if (item.path) {
              return (
                <Link href={item.path} key={index}>
                  <SidebarItem
                    icon={item.icon}
                    text={item.text}
                    expanded={expanded}
                    active={activeContent === item.contentId}
                  />
                </Link>
              );
            }
            return (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                expanded={expanded}
                active={activeContent === item.contentId}
                onClick={() => setActiveContent(item.contentId)}
              />
            );
          })}
        </ul>

        <div className="border-t flex p-3">
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{session.user.fullName}</h4>
              <span className="text-xs text-gray-600">{session.user.email}</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;