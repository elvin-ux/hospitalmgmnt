import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PatientLogin from "./components/PatientLogin";
import PatientRegister from "./components/PatientRegister";
import BookAppointment from "./components/BookAppointment";
import Myappointments from "./components/Myappointments";
import PatientProfile from "./components/PatientProfile";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AddDoctor from "./components/AddDoctor";
import ManagePatients from "./components/ManagePatients";
import ManageAppointments from "./components/ManageAppointments";
import DoctorLogin from "./components/Doctorlogin";
import DoctorProfile from "./components/DoctorProfile";
import MyPatients from "./components/MyPatients";
import DoctorSchedule from "./components/DoctorSchedule";
import LandingPage from "./components/LandingPage";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/register" element={<PatientRegister />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/myappointments" element={<Myappointments />} />
        <Route path="/profile" element={<PatientProfile/>} />
        <Route path="/admin" element={<AdminLogin/>} />
         <Route path="/dashboard" element={<AdminDashboard/>} />
         <Route path="/admin/adddoctor" element={<AddDoctor/>} />
         <Route path="/admin/patients" element={<ManagePatients/>} />
          <Route path="/admin/appointments" element={<ManageAppointments/>} />
           <Route path="/doctorlogin" element={<DoctorLogin/>} />
           <Route path="/doctor/profile" element={<DoctorProfile/>} />
           <Route path="/doctor/patients" element={<MyPatients/>} />
            <Route path="/doctor/schedule" element={<DoctorSchedule/>} />
      </Routes>
    </Router>
  );
}

export default App;
