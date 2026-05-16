import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scene from "./pages/Scene";
import { MuteProvider } from "./context/MuteContext";
import AppWidePrompt from "./components/AppWidePrompt";

function App() {
  return (
    <MuteProvider>
      <AppWidePrompt>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scene/:id" element={<Scene />} />
          </Routes>
        </BrowserRouter>
      </AppWidePrompt>
    </MuteProvider>
  );
}

export default App;