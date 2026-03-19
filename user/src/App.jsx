import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import {
  LandingPage,
  Header,
  OurMission,
  Service,
  Testinomial,
  Footer,
  RequestCard,
  UserDashboard,
  Auth,
  Requests,
  ThemeToggle,
} from './handler/index.js';

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard/user/');
  const isAuthRoute = location.pathname.startsWith('/login');
  const hideChrome = isDashboardRoute || isAuthRoute;

  return (
    <>
      {!hideChrome && <Header />}

      <main className="w-full">
        <Routes>
          {/* Define the paths for your project */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/our-mission" element={<OurMission />} />

          {/* You can add these as you build them */}
          <Route
            path="/services"
            element={
              <div className="pt-32 text-center text-3xl font-bold">
                <Service></Service>
              </div>
            }
          />
          <Route path="/pending-requests" element={<Requests />} />
          <Route path="/login" element={<Auth />} />
          <Route
            path="/testimonials"
            element={
              <div className="pt-32 text-center text-3xl font-bold">
                <Testinomial />
              </div>
            }
          />
          <Route path="/dashboard/user/:id" element={<UserDashboard />} />
        </Routes>
      </main>
      {!hideChrome && <RequestCard className="" />}
      {!hideChrome && <Footer />}
      <ThemeToggle />
    </>
  );
}

export default App;
