import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  LandingPage,
  Header,
  OurMission,
  Service,
  Testinomial,
} from './handler/index.js';

function App() {
  return (
    <>
      {/* Header stays outside Routes so it shows on every page */}
      <Header />

      <main>
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
          <Route
            path="/pending-requests"
            element={
              <div className="pt-32 text-center text-3xl font-bold">
                Pending Requests coming soon...
              </div>
            }
          />
          <Route
            path="/testimonials"
            element={
              <div className="pt-32 text-center text-3xl font-bold">
                <Testinomial />
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
