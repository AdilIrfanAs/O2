import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import StatsPage from "./components/Stats/Index";
import TokenManagement from "./components/TokenManagement/Index";
import BridgeV2 from "./components/Bridgev2/bridg2v2";
import CallbackPage from "./utils/Custom-Wallet/Discord_Callback";
import TokenManagementV2 from "./components/TokenManagementV2/Index";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bridge-v2" element={<BridgeV2 />} />
        <Route path="/token-management" element={<TokenManagement />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/token-management-v2" element={<TokenManagementV2 />} />
        <Route path="/discord/callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
};

export default App;
