import { Avatar, Card, CardHeader } from '@mui/material';
import React from 'react';

const NewCustomCard = ({ img, title, subtitle, children, style }) => {


  return (
    <Card sx={style}>
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <img src={profilePIC} alt='Avatar' />
          </Avatar>
        }
        title={title}
        subheader={subtitle}
      />
      {children}
    </Card>
  );
};

export default NewCustomCard;
