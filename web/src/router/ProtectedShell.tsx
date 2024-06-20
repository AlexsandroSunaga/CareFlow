import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { getToken } from "@/api/client";

const Command = lazy(() => import("@/views/console/command"));
const Scheduling = lazy(() => import("@/views/console/scheduling"));
const FrontDesk = lazy(() => import("@/views/console/front-desk"));
const Cases = lazy(() => import("@/views/console/cases"));
const Intake = lazy(() => import("@/views/console/intake"));
const Labs = lazy(() => import("@/views/console/labs"));
const Imaging = lazy(() => import("@/views/console/imaging"));
const Pharmacy = lazy(() => import("@/views/console/pharmacy"));
const Departments = lazy(() => import("@/views/console/departments"));
const DepartmentDetail = lazy(() => import("@/views/console/departments/detail"));
const Staff = lazy(() => import("@/views/console/staff"));
const Billing = lazy(() => import("@/views/console/billing"));
const Compliance = lazy(() => import("@/views/console/compliance"));
const BedBoard = lazy(() => import("@/pages/ConsoleBedBoardPage/ConsoleBedBoardPage"));
const Analytics = lazy(() => import("@/pages/ConsoleAnalyticsPage/ConsoleAnalyticsPage"));
const Reports = lazy(() => import("@/pages/ConsoleReportsPage/ConsoleReportsPage"));
const Fhir = lazy(() => import("@/pages/ConsoleFhirPage/ConsoleFhirPage"));
const Discharge = lazy(() => import("@/pages/ConsoleDischargePage/ConsoleDischargePage"));

export default function ProtectedShell() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ConsoleShell>
      <Routes>
        <Route path="/console" element={<Command />} />
        <Route path="/console/scheduling" element={<Scheduling />} />
        <Route path="/console/front-desk" element={<FrontDesk />} />
        <Route path="/console/beds" element={<BedBoard />} />
        <Route path="/console/cases" element={<Cases />} />
        <Route path="/console/intake" element={<Intake />} />
        <Route path="/console/labs" element={<Labs />} />
        <Route path="/console/imaging" element={<Imaging />} />
        <Route path="/console/pharmacy" element={<Pharmacy />} />
        <Route path="/console/departments" element={<Departments />} />
        <Route path="/console/departments/:id" element={<DepartmentDetail />} />
        <Route path="/console/staff" element={<Staff />} />
        <Route path="/console/billing" element={<Billing />} />
        <Route path="/console/compliance" element={<Compliance />} />
        <Route path="/console/analytics" element={<Analytics />} />
        <Route path="/console/reports" element={<Reports />} />
        <Route path="/console/fhir" element={<Fhir />} />
        <Route path="/console/discharge" element={<Discharge />} />
        <Route path="*" element={<Navigate to="/console" replace />} />
      </Routes>
    </ConsoleShell>
  );
}
