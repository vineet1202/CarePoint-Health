import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { PatientRegisterPage } from "../features/auth/pages/PatientRegisterPage";
import { DoctorRegisterPage } from "../features/auth/pages/DoctorRegisterPage";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FindDoctorsPage from "@/features/doctors/pages/FindDoctorsPage";
import DoctorDetailsPage from "@/features/doctors/pages/DoctorDetailsPage";
import { MyAppointments } from "@/features/appointments/pages/myAppointments";
import PatientDashboardPage from "../features/patient/pages/PatientDashboard";
import DoctorDashboardPage from "@/features/doctors/pages/DoctorDashboard";
import DoctorSlotsPage from "@/features/doctors/pages/DoctorSlotsPage";
import DoctorAppointmentsPage from "@/features/appointments/pages/DoctorAppointmentsPage";
import DoctorPatientHistoryPage from "@/features/appointments/pages/DoctorPatientHistoryPage";
import PatientProfilePage from "@/features/patient/pages/PatientProfilePage";
import DoctorProfilePage from "@/features/doctors/pages/DoctorProfilePage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/patient" element={<PatientRegisterPage />} />
        <Route path="/register/doctor" element={<DoctorRegisterPage />} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/patient/dashboard"
              element={<PatientDashboardPage />}
            />
            <Route path="/patient/doctors" element={<FindDoctorsPage />} />
            <Route
              path="/patient/doctors/:doctorId"
              element={<DoctorDetailsPage />}
            />
            <Route path="/patient/appointments" element={<MyAppointments />} />
            <Route path="/patient/profile" element={<PatientProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
            <Route path="/doctor/slots" element={<DoctorSlotsPage />} />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointmentsPage />}
            />
            <Route
              path="/doctor/patients/:patientId/history"
              element={<DoctorPatientHistoryPage />}
            />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
          </Route>
        </Route>

        {/* <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
