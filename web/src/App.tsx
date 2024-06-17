import { ConfigProvider, Spin } from "antd";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAntdTheme } from "@/theme/useAntdTheme";

const LoginPage = lazy(() => import("@/views/login"));
const ProtectedShell = lazy(() => import("@/router/ProtectedShell"));
const MarketingHome = lazy(() => import("@/pages/LandingPage/LandingPage"));
const SecurityPage = lazy(() => import("@/pages/SecurityPage/SecurityPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage/ContactPage"));
const About = lazy(() => import("@/views/marketing/about"));
const ForClinicians = lazy(() => import("@/views/marketing/for-clinicians"));
const Locations = lazy(() => import("@/views/marketing/locations"));
const PatientGuide = lazy(() => import("@/views/marketing/patient-guide"));
const PortalBook = lazy(() => import("@/views/portal/book"));
const PortalIntake = lazy(() => import("@/views/portal/intake"));

const fallback = (
  <div style={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
    <Spin size="large" />
  </div>
);

export default function App() {
  const themeConfig = useAntdTheme();

  return (
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<MarketingHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-clinicians" element={<ForClinicians />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/patient-guide" element={<PatientGuide />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/portal/book" element={<PortalBook />} />
            <Route path="/portal/intake" element={<PortalIntake />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedShell />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}
