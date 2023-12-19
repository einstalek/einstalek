import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Markdown from "./Markdown";
import Container from "@mui/material/Container";


function Post({config}) {
  const params = useParams();
  const [text, setText] = useState("");
  
  useEffect(() => {
    const context = require.context('./markdown/', false, /\.md$/);
    const files = context.keys().map((key) => {
      const fileName = key.replace('./', '');
      return { fileName };
    });
    const targetFile = files.find(file => file.fileName.includes(params.ID));

    import(`./markdown/${targetFile.fileName}`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setText(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

  });

  return (
    <Container maxWidth="md">
            <Card variant="outlined" sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: 1 }}>
                    <Markdown key={0}>
                    {text}
                    </Markdown>
                </CardContent>
            </Card>
    </Container>
  )
};

export default Post;
