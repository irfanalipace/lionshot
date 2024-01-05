import React from 'react';
import CustomDrawer from '../Drawer/Drawer';
import { Grid, Paper, Typography } from '@mui/material';
import GridRow from '../GridRow/GridRow';
import { Close } from '@mui/icons-material';
import { Box, Stack } from '@mui/system';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import CommentIcon from '@mui/icons-material/Comment';
import EditNoteIcon from '@mui/icons-material/EditNote';

function HistoryDrawer({ openDrawer, setHistoryDrawer, DrawerTitle, timelineData }) {
  return (
    <>
      <CustomDrawer open={openDrawer} onClose={() => setHistoryDrawer(false)} dWidth>
        <Box p={3}>
          <GridRow>
            <Grid item xs={6}>
              <Typography variant="h6">{DrawerTitle}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Close sx={{ cursor: 'pointer' }} onClick={() => setHistoryDrawer(false)} />
            </Grid>
          </GridRow>
          <Timeline>
            {timelineData.map((item, index) => (
              <TimelineItem key={index} sx={{ ':before': { display: 'none' } }}>
                <TimelineSeparator>
                  <TimelineDot sx={{ bgcolor: 'transparent', borderColor: '#D3DCE4' }}>
                    {/* {item.icon === 'comment' ? ( */}
                      <CommentIcon sx={{ color: '#73B0F9' }} />
                    {/* ) : (
                      <EditNoteIcon sx={{ color: '#F0B11A' }} />
                    )} */}
                  </TimelineDot>
                  {index !== timelineData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ pb: '50px' }}>
                  <Stack direction="row">
                    <Typography variant="body2" component="span">
                      {item.title}
                    </Typography>
                    <ul style={{ marginLeft: '30px' }}>
                      <li style={{ listStyle: 'outside', color: '#B0ADBD' }}></li>
                    </ul>
                    <Typography variant="caption" component="span" sx={{ color: '#838195', margin: '3px 0 0 -8px' }}>
                      {item.timestamp}
                    </Typography>
                  </Stack>
                  <Paper elevation={2} sx={{ padding: '5px 10px' }}>
                    {item.content}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </CustomDrawer>
    </>
  );
}

export default HistoryDrawer;
