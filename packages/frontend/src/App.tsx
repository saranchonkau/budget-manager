import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import SignUpPage from "@/modules/auth/sign-up/SignUpPage";

function App() {
  return (
    <Layout>
      <SignUpPage />
    </Layout>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Layout />}>
    //       <Route index element={<h1>hey</h1>} />
    //       <Route path="auth" element={} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
