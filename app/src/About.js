import React, { useState, useEffect } from "react";
import AboutMarkdown from "./docs/about.md";
import Markdown from "./Markdown";
import Container from "@mui/material/Container";


function About() {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch(AboutMarkdown)
            .then(res => res.text())
            .then(text => setMarkdown(text))
        return () => {
        };
    }, []);

    return (
    <Container maxWidth="md">
        <Markdown className="cv-markdown" key={1}>
            {markdown}
        </Markdown>
    </Container>
    )
};

export default About;