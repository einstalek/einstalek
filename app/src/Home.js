import TopPanel from "./TopPanel";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import PostGrid from "./PostGrid";
import CV from "./CV";
import Post from "./Post";
import About from "./About";

import {
    Routes, 
    BrowserRouter,
    Route, Navigate
  } from "react-router-dom";

function Home() {
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    const [darkMode, setDarkMode] = React.useState(storedDarkMode);
    
    const config = require("./docs/config.json");

    useEffect(() => {
      const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
      if (storedDarkMode !== null && storedDarkMode !== undefined) {
        setDarkMode(storedDarkMode);
      }
    }, []);

    useEffect(() => {
         localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
      const context = require.context('./markdown/', false, /\.md$/);
      const files = context.keys().map((key) => {
        const fileName = key.replace('./', '');
        return { fileName };
      });
    }, []);

    const darkTheme = createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        }, 
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        }
    });

    return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <div className="Home">
              <BrowserRouter>
                
                <div>
                  <TopPanel darkMode={darkMode} setDarkMode={setDarkMode}/>
                  
                  <div style={{ marginTop: '10px' }}></div>

                  <Routes>
                      <Route path="/" element={
                        <div>
                          <About />
                          <div style={{ marginBottom: '20px' }}/>
                          <PostGrid config={config} />
                        </div>
                      } />
                      <Route path="/blog/:ID" element={<Post config={config} />} />
                      <Route path="/cv" element={<CV />} />
                      <Route path="/" element={<Navigate to="/blog" />} />
                  </Routes>

                </div>

              </BrowserRouter>
          </div>
      </ThemeProvider>
  )
}

export default Home;