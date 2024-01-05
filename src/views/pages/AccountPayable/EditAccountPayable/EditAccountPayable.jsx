import AccountPayableForm from '../Components/AccountPayableForm'
import HeaderPaper from '../../../Components/Containers/HeaderPaper'
import GridRow from '../../../Components/GridRow/GridRow'
import { Grid, IconButton, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import { useNavigate,useParams } from 'react-router-dom'
import { decryptId } from '../../../../core/utils/helpers'

function EditAccountPayable() {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <div>
      
      <HeaderPaper>
				<GridRow style={{ marginBottom: '0px', alignItems: 'center' }}>
					<Grid item xs={6}>
						<Typography variant='h6'>Edit Account Payable</Typography>
					</Grid>
					<Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
						<IconButton onClick={() => navigate('/account-payable')}>
							<Close />
						</IconButton>
					</Grid>
				</GridRow>
			</HeaderPaper>
<AccountPayableForm id={decryptId(params.id)} />

    </div>
  )
}

export default EditAccountPayable