import React from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Home, About, Contact } from "./pages/index.js";

const App = () => {
  return (
    <main className="bg-black">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
