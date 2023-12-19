import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';


export default function Card({imageURL, imageDesc}) {
    function render() {
        if (!imageURL) {
            return (
                <h2> Search a book by title </h2>
            )
        } else {
            console.log(imageURL);
            return (
                <p> 
                    <a href={imageURL}> {imageDesc} </a> 
                </p>
            )
        }
    }

    return (
        <Paper
        sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            variant: "elevation",
            // backgroundImage: `url(${image_url})`,
        }}>
            {render()}
        </Paper>
    )
};