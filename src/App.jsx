import { Box, Container, Link } from "@chakra-ui/layout";
import { Route, Routes } from "react-router";
import "./App.css";
import CalculateAvg from "./Components/CalculateAvg";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import ProcessVideo from "./Components/ProcessVideo";
import Register from "./Components/Register";
import Uploads from "./Components/Uploads";
import UploadDetails from "./Components/UploadDetails";
import ProcessPicture from "./Components/ProcessPicture";

function App() {
  return (
    <Box className="App" bg="blue.500">
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<ProcessPicture />} />
          <Route path="/uploads" element={<Uploads />} />
          <Route path="/upload-details/:id" element={<UploadDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Box>
  );
}

export default App;
