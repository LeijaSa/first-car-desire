import React, { useState } from "react";
import "./App.css";
import { Container, Typography } from "@mui/material";
//import Login from "./components/Login";
//import Carlist from "./components/Carlist";
import { Route, Routes } from "react-router-dom";

const App: React.FC = (): React.ReactElement => {
   const [token, setToken] = useState<string>(
      String(localStorage.getItem("token"))
   );

   return (
      <Container>
         <Typography variant="h4" sx={{ marginBottom: 2, marginTop: 2 }}>
            Autolistaus
         </Typography>
      </Container>
   );
};

export default App;
