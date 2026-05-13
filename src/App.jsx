import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scene from "./pages/Scene";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene/:id" element={<Scene />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;