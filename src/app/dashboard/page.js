"use client";
import React, { useState } from 'react';
import SideBar from '@/components/SideBar';
import { MainContent } from '@/components/MainContent';

const DashboardPage = () => {
  const [activeContent, setActiveContent] = useState('statistics');

  return (
    <div className="flex flex-row bg-gray-50">
      <SideBar activeContent={activeContent} setActiveContent={setActiveContent} />
      <MainContent activeContent={activeContent} />
    </div>
  );
};

export default DashboardPage;