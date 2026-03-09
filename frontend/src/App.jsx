import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
// Page Components
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Jobs from './pages/Jobs';
import Internships from './pages/Internships';
import AboutPortal from './pages/AboutPortal';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
        {/* Sidebar: Fixed width, full height */}
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Navbar: Full width, fixed height */}
          <Navbar />

          {/* Main Content: This is the ONLY scrollable area */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12 text-gray-800">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/internships" element={<Internships />} />
                <Route path="/about" element={<AboutPortal />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;