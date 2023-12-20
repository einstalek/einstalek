import * as React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';


function FeaturedPost(props) {
  const {info} = props;

  return (
      <CardActionArea component="a" href={'/blog/' + info.id} sx={{marginBottom: 3}}>
        <Card variant='outlined' sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h6">
              {info.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {info.date}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {info.description}
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
  );
}

export default FeaturedPost;