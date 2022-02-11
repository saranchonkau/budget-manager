import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import SignUpPage from "@/modules/auth/sign-up/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Hey, this is budget-manager app :)</h1>} />
          <Route path="auth" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
