import PostPreview from "./PostPreview";
import { Grid } from "@mui/material";
import Container from "@mui/material/Container";


function PostGrid({config}) {
    return (
      <Container maxWidth="md">
        <Grid width={1} marginLeft={0.1} container columns={1} spacing={2} sx={{ mt: 1 }}>
            {config["posts"].map((info) => (
            <PostPreview key={info.id} info={info} />
            ))}
        </Grid>
      </Container>
    )
}

export default PostGrid;