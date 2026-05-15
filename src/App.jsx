import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scene from "./pages/Scene";
import { MuteProvider } from "./context/MuteContext";

function App() {
  return (
    <MuteProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scene/:id" element={<Scene />} />
        </Routes>
      </BrowserRouter>
    </MuteProvider>
  );
}

export default App;