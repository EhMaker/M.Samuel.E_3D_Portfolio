import React from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Home } from "./pages/index.js";

const App = () => {
  return (
    <main className="bg-black">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
