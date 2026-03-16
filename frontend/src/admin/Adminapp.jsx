import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Students from "../pages/Students";
import Courses from "./pages/Courses";
import Internships from "./pages/Internships";
import Jobs from "./pages/Jobs";
import StudentProfile from "../pages/StudentProfile";

function Adminapp() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="courses" element={<Courses />} />
        <Route path="internships" element={<Internships />} />
        <Route path="jobs" element={<Jobs />} />
      </Route>
    </Routes>
  );
}

export default Adminapp;