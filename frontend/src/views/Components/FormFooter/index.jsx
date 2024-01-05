import { Box, Grid, Paper, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import MUIButton from 'components/Button/MUIButton';
import { goBack } from 'core/utils/helpers';

export default function FormFooter({ onSubmit, isSubmitting, btnType }) {
	return (
		<Box
			style={{
				position: 'fixed',
				bottom: 0,
				width: '100%',
				zIndex: 9999,
			}}
		>
			<Paper elevation={10} style={{ padding: '.2rem 1rem 2rem 1rem' }}>
				<Grid container>
					<Grid
						item
						xs={12}
						display='flex'
						alignItems='center'
						mt='2rem'
						pl='2rem'
					>
						<Stack direction='row' spacing={2}>
							<LoadingButton
								type='submit'
								variant='outlined'
								onClick={() => onSubmit('draft')}
								disabled={isSubmitting}
								loading={isSubmitting && btnType === 'draft'}
							>
								Save as Draft
							</LoadingButton>

							<LoadingButton
								// sx={{ fontWeight: 500, fontSize: '0.9rem' }}
								variant='contained'
								type='submit'
								onClick={() => onSubmit('sent')}
								disabled={isSubmitting}
								loading={isSubmitting && btnType === 'sent'}
							>
								Save and send
							</LoadingButton>
							<MUIButton variant='outlined' onClick={goBack}>
								Cancel
							</MUIButton>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
}
