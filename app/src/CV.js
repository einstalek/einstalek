import React, { useState, useEffect } from "react";
import CVMarkdown from "./docs/cv.md";
import Markdown from "./Markdown";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function CV() {
    const [markdown, setMarkdown] = useState("");
    useEffect(() => {
        fetch(CVMarkdown).then(res => res.text()).then(text => setMarkdown(text));
        return () => {
        };
    }, []);

    return (
        <Container maxWidth="md">
            <Card variant="outlined" sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: 1 }}>
                    <Markdown key={"cv"}>
                    {markdown}
                    </Markdown>
                </CardContent>
            </Card>
        </Container>
    )
};

export default CV;