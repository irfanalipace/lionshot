import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import CommentIcon from '@mui/icons-material/Comment';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Typography from '@mui/material/Typography';
import { Paper, Stack } from '@mui/material';

export default function ActivityTimeLine({ activityData }) {
	return (
		<>
			{activityData?.length > 0 ? (
				<Timeline>
					<TimelineItem sx={{ ':before': { display: 'none' } }}>
						<TimelineSeparator>
							<TimelineDot
								sx={{ bgcolor: 'transparent', borderColor: '#D3DCE4' }}
							>
								<CommentIcon sx={{ color: '#73B0F9' }} />
							</TimelineDot>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent sx={{ pb: '50px' }}>
							<Stack direction='row'>
								<Typography variant='body2' component='span'>
									Zoho Books
								</Typography>
								<ul style={{ marginLeft: '30px' }}>
									<li style={{ listStyle: 'outside', color: '#B0ADBD' }}></li>
								</ul>
								<Typography
									variant='caption'
									component='span'
									sx={{ color: '#838195', margin: '3px 0 0 -8px' }}
								>
									15 Jun 2023 02:11 AM
								</Typography>
							</Stack>
							<Paper elevation={2} sx={{ padding: '5px 10px' }}>
								Because you need strength
							</Paper>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem sx={{ ':before': { display: 'none' } }}>
						<TimelineSeparator>
							<TimelineDot
								sx={{ bgcolor: 'transparent', borderColor: '#D3DCE4' }}
							>
								<EditNoteIcon sx={{ color: '#F0B11A' }} />
							</TimelineDot>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent sx={{ pb: '50px' }}>
							<Stack direction='row'>
								<Typography variant='body2' component='span'>
									Zoho Books
								</Typography>
								<ul style={{ marginLeft: '30px' }}>
									<li style={{ listStyle: 'outside', color: '#B0ADBD' }}></li>
								</ul>
								<Typography
									variant='caption'
									component='span'
									sx={{ color: '#838195', margin: '3px 0 0 -8px' }}
								>
									15 Jun 2023 02:11 AM
								</Typography>
							</Stack>
							<Paper elevation={2} sx={{ padding: '5px 10px' }}>
								Because you need strength
							</Paper>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem sx={{ ':before': { display: 'none' } }}>
						<TimelineSeparator>
							<TimelineDot
								sx={{ bgcolor: 'transparent', borderColor: '#D3DCE4' }}
							>
								<CommentIcon sx={{ color: '#73B0F9' }} />
							</TimelineDot>
						</TimelineSeparator>
						<TimelineContent sx={{ pb: '50px' }}>
							<Stack direction='row'>
								<Typography variant='body2' component='span'>
									Zoho Books
								</Typography>
								<ul style={{ marginLeft: '30px' }}>
									<li style={{ listStyle: 'outside', color: '#B0ADBD' }}></li>
								</ul>
								<Typography
									variant='caption'
									component='span'
									sx={{ color: '#838195', margin: '3px 0 0 -8px' }}
								>
									15 Jun 2023 02:11 AM
								</Typography>
							</Stack>
							<Paper elevation={2} sx={{ padding: '5px 10px' }}>
								Because you need strength
							</Paper>
						</TimelineContent>
					</TimelineItem>
				</Timeline>
			) : (
				<Typography p={4}>No Activity Found</Typography>
			)}
		</>
	);
}
