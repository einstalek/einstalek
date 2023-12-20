import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { SvgIcon } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { ReactComponent as Logo } from "./aristotle.svg";

const pages = [['Blog', '/'], ['CV', '/cv']];


function TopPanel({darkMode, setDarkMode}) {
    const currentPath = useLocation().pathname;


    return (
        <Box>
            <AppBar position="static" style={{ color: 'inherit', 
                            background: 'transparent',
                            boxShadow: 'none'
                            }} >
                <Container maxWidth="md">
                    <Toolbar disableGutters>

                    <SvgIcon 
                        fontSize='large' 
                        component={Logo} inheritViewBox 
                    />

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        mr: 2,
                        fontFamily: 'monospace',
                        fontWeight: 500,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        AbsurdAI
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map(([page, link]) => (
                        <Button
                            key={page}
                            href={link}
                            sx={{ my: 2, color: 'inherit', display: 'block' }}
                        >
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 500,
                                letterSpacing: '.1rem',
                                color: 'inherit',
                                textDecoration: link === currentPath ? "underline": "none"
                                }}
                            >
                                {page}
                            </Typography>

                        </Button>
                        ))}
                    </Box>

                    <IconButton aria-label="switch" 
                                    onClick={() => {
                                        setDarkMode(!darkMode);
                                        console.log('Click');
                                        }}>
                                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}

export default TopPanel;
