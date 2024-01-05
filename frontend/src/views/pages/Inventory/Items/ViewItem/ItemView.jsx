import { Grid, IconButton, Paper, Typography, useTheme } from '@mui/material';
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';
import GridRow from '../../../../Components/GridRow/GridRow';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../../../Components/ConfirmDialog/ConfirmDialog';
import { headerMenuBox } from '../../../Customer/CustomerStylesConst';
import {
  formatDate,
  formatDateAndTime,
  generateEncryptedID
} from '../../../../../core/utils/helpers';
import { deleteItem, itemsSingleApi } from '../../../../../core/api/items';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import OverlayLoader from '../../../../Components/OverlayLoader/OverlayLoader';
import HoverPopover from '../../../../Components/HoverPopover/ErrorOutlinePopover';

const ItemView = ({ id, setRefresh }) => {
  const navigate = useNavigate();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(true);
  const [defaultImage, setDefaultImage] = useState(0);
  const theme = useTheme();
  const getSingleItem = async () => {
    try {
      const singleItem = await itemsSingleApi(id);
      setItemData(singleItem);
      setLoading(false); // Set loading to false when data is loaded
    } catch (e) {
      console.log(e);
      setLoading(false);
      navigate('/items');
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true when the id changes
    getSingleItem();
  }, [id]);

  const handleDelete = async id => {
    try {
      await deleteItem(id);
      setRefresh(prev => prev + 1);
      navigate('/items');
    } catch (err) {
      console.log('err', err);
    }
  };
  const itemData2 = {
    ebay_item_number: '3546813146',
    condition: 'Used',
    brand: 'Used',
    external_interface: 'Ether/Network Cards',
    number_of_ports: '2',
    mpn: '0DF5464',
    interface: 'SATA',
    upc: 'does not apply',

    seller_notes:
      'pulled from a Working Unit, 100% Testing serve is not working',
    form_factor: 'High Profile',
    type: 'LAN card',
    model: 'P0083483',
    compatible_port: 'P00 Express',
    max_data_rate: '10 Gbps',
    last_sync_date: '10 nov 2022'
  };
  return (
    <>
      <Box
        sx={{
          position: 'relative'
        }}>
        <OverlayLoader open={loading} />
        <HeaderPaper>
          <GridRow style={{ marginBottom: '0px' }}>
            <Grid item xs={6}>
              <Typography variant='h6'>Item View</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              style={{ display: 'flex', justifyContent: 'end' }}>
              <Box sx={headerMenuBox}>
                {/* <IconButton
                  sx={{
                    fontSize: '16px',
                    border: '1px solid #2196F3',
                    borderRadius: '3px',
                    padding: '5px 15px',
                    color: window.themeColors.primary
                  }}
                  onClick={() =>
                    navigate(`/items/edit/${generateEncryptedID(itemData?.id)}`)
                  }>
                  Edit
                </IconButton>
                <IconButton
                  sx={{
                    fontSize: '16px',
                    border: '1px solid #2196F3',
                    borderRadius: '3px',
                    padding: '5px 15px',
                    color: window.themeColors.primary,
                    marginLeft: '4px'
                  }}
                  onClick={() => {
                    setOpenConfirmDialog(true);
                    setDialogProps({
                      onConfirm: () => handleDelete(itemData.id)
                    });
                  }}>
                  Delete
                </IconButton> */}
                {/* <Dropdown>
									<HeaderMenuButton
										style={{
											color: 'black',
											padding: '10px 10px 10px 15px',
											marginLeft: '10px',
										}}
									>
										More
										<ArrowDropDown sx={{ margin: '-3px 0 -8px 0' }} />
									</HeaderMenuButton>
									<Menu slots={{ listbox: StyledListbox }}>
										<StyledMenuItem> Clone Item</StyledMenuItem>
										<StyledMenuItem> Mark as Inactive</StyledMenuItem>
										<StyledMenuItem
											onClick={() => {
												setOpenConfirmDialog(true);
												setDialogProps({
													onConfirm: () => handleDelete(itemData.id),
												});
											}}
										>
											{' '}
											Delete
										</StyledMenuItem>
									</Menu>
								</Dropdown> */}
                <IconButton
                  style={{ color: 'black' }}
                  onClick={() => navigate('/items')}>
                  <CloseIcon sx={{ color: '#0000008F' }} />
                </IconButton>
              </Box>
            </Grid>
          </GridRow>
        </HeaderPaper>

        <Paper
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            marginTop: '20px',
            padding: '20px'
          }}>
          <Typography variant='h6' mb={2}>
            Item Details
          </Typography>
          <Grid container>
            <Grid item xs={9}>
              {/* Title  */}
              <GridRow>
                <Grid item xs={3}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Title
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant='body2'>{itemData?.title}</Typography>
                </Grid>
              </GridRow>
              <Grid container>
                {/* 1st colum  */}
                <Grid item xs={6}>
                  {/* Item ID  */}
                  <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Item ID:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        {itemData?.item_id || 'N/A'}
                      </Typography>
                    </Grid>
                  </GridRow>
                  {/* Item ID  */}
                  {/* <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Item Type:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        {itemData?.item_id || 'N/A'}
                      </Typography>
                    </Grid>
                  </GridRow> */}
                  {/* Bullet Points  */}
                  {/* <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Bullet Points:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        {itemData?.item_id || 'N/A'}
                      </Typography>
                    </Grid>
                  </GridRow> */}
                  {/* Created Date  */}
                  <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Created Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        {formatDate(itemData?.created_at) || 'N/A'}
                      </Typography>
                    </Grid>
                  </GridRow>
                  {/* Operating System  */}
                  {/* <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Operating System
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        {itemData.operating_system || 'N/A'}
                      </Typography>
                    </Grid>
                  </GridRow> */}
                </Grid>
                {/* space Grid  */}
                <Grid item xs={1}></Grid>
                {/* 2nd Colum */}
                <Grid item xs={5}>
                  {/* Cost  */}
                  <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Cost:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        ${itemData?.cost || 0}
                      </Typography>
                    </Grid>
                  </GridRow>
                  {/* Sale Price  */}
                  <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Sales Price:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        ${itemData?.selling_price || 0}
                      </Typography>
                    </Grid>
                  </GridRow>
                  {/* Sales Start Date  */}
                  {/* <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Sales Start Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        {formatDate(itemData?.sales_start_date) || 'N/A'}
                      </Typography>
                    </Grid>
                  </GridRow> */}
                  {/* Sales End Date  */}
                  {/* <GridRow>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ color: theme.palette.dim.main }}>
                        Sales End Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        {formatDate(itemData?.sales_end_date) || 'N/A'}
                      </Typography>
                    </Grid>
                  </GridRow> */}
                </Grid>
              </Grid>
            </Grid>
            {/* Grid for item image */}
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              {itemData?.item_images?.length > 0 && (
                <>
                  <Box
                    sx={{
                      width: '170px',
                      height: '170px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 'auto'
                    }}>
                    <img
                      src={itemData?.item_images[defaultImage]?.image}
                      alt=''
                      width={'100%'}
                      style={{ maxWidth: '160px' }}
                      objectFit='contain'
                    />
                  </Box>
                  <Grid
                    container
                    mt={1}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {itemData?.item_images?.map((img, index) => (
                      <Grid
                        item
                        xs={3.5}
                        m={0.5}
                        p={0.5}
                        container
                        alignItems={'center'}
                        border={defaultImage === index ? 1 : 0}>
                        <img
                          src={img?.image}
                          alt=''
                          width={'100%'}
                          onClick={() => setDefaultImage(index)}
                          style={{ cursor: 'pointer' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          {/* ---------- item details end here --------- */}
          <Typography variant='h6' mt={2} mb={1}>
            eBay
          </Typography>
          <Grid container mb={2}>
            <Grid item xs={6}>
              <Typography variant='body2'>
                Seller assumes all responsibility for this listing.
              </Typography>
            </Grid>
            {/* <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Box variant='body2'>
                <Typography
                  variant='body2'
                  color={'primary'}
                  component={'span'}>
                  eBay Number:
                </Typography>
                <Typography variant='body2' component={'span'} ml={1}>
                  {itemData2?.ebay_item_number}
                </Typography>
              </Box>
            </Grid> */}
          </Grid>
          <Typography variant='body1bold'>Specifications</Typography>
          {/* Ebay item Details Grid  */}
          <Grid container mt={2}>
            <Grid item xs={5.3}>
              {/* Condition  */}
              <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Condition:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData?.condition_name || 'N/A'}
                  </Typography>
                </Grid>
              </GridRow>
              {/* Category  */}
              <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Category:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData?.category?.name || 'N/A'}
                  </Typography>
                </Grid>
              </GridRow>
              {/* Quantity  */}
              <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Quantity:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData?.quantity || 'N/A'}
                  </Typography>
                </Grid>
              </GridRow>
              {/* Brand  */}
              <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Brand:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData?.brand?.name || 'N/A'}
                  </Typography>
                </Grid>
              </GridRow>
              {/* External interface */}
              {/* <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    External interface:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData2?.external_interface}
                  </Typography>
                </Grid>
              </GridRow> */}
              {/* Number of Ports */}
              {/* <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Number of Ports:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData2?.external_interface}
                  </Typography>
                </Grid>
              </GridRow> */}
              {/* SKU  */}
              <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    SKU:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData?.sku || 'N/A'}
                  </Typography>
                </Grid>
              </GridRow>
              {/* MPN Number  */}
              <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    MPN:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData?.mpn || 'N/A'}
                  </Typography>
                </Grid>
              </GridRow>
              {/* Interface  */}
              {/* <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Interface:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>
                    {itemData?.part_number}
                  </Typography>
                </Grid>
              </GridRow> */}
              {/* UPC  */}
              {/* <GridRow>
                <Grid item xs={5}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    UPC:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant='body2'>{itemData2?.upc}</Typography>
                </Grid>
              </GridRow> */}
            </Grid>

            <Grid item xs={5.7}>
              {/* Seller Notes  */}
              {/* <GridRow>
                <Grid item xs={4}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Seller Notes:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant='body2'
                    sx={{
                      width: '200px',
                      whiteSpace: ' nowrap',
                      overflow: ' hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block'
                    }}>
                    {itemData2?.seller_notes}
                  </Typography>
                  <HoverPopover text={itemData2?.seller_notes}></HoverPopover>
                </Grid>
              </GridRow> */}
              {/* Form Factor  */}
              {/* <GridRow>
                <Grid item xs={4}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Form Factor:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>
                    {itemData2?.form_factor}
                  </Typography>
                </Grid>
              </GridRow> */}
              {/* Type */}
              {/* <GridRow>
                <Grid item xs={4}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Type:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>{itemData2?.type}</Typography>
                </Grid>
              </GridRow> */}
              {/* Modal */}
              {/* <GridRow>
                <Grid item xs={4}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Modal:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>{itemData2?.model}</Typography>
                </Grid>
              </GridRow> */}
              {/* Compatible Port */}
              {/* <GridRow>
                <Grid item xs={4}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Compatible Port:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>
                    {itemData2?.compatible_port}
                  </Typography>
                </Grid>
              </GridRow> */}
              {/* Maximum Data Rate*/}
              {/* <GridRow>
                <Grid item xs={4}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Maximum Data Rate:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>
                    {itemData2?.max_data_rate}
                  </Typography>
                </Grid>
              </GridRow> */}
              {/* Last Sync Date*/}
              <GridRow>
                <Grid item xs={4}>
                  <Typography
                    variant='body2'
                    sx={{ color: theme.palette.dim.main }}>
                    Last Sync Date:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>
                    {formatDateAndTime(itemData?.last_sync || 'N/A')}
                  </Typography>
                </Grid>
              </GridRow>
            </Grid>
          </Grid>
          <Box
            sx={{
              '&, & *': {
                fontSize: '14px !important',
                fontFamily: 'Roboto !important',
                fontWeight: '400 !important',
                color: 'rgba(0, 0, 0, 0.87)'
              }
            }}
            dangerouslySetInnerHTML={{
              __html: itemData?.description
            }}></Box>
          {/* <Box aria-label='description-from-seller' mt={2}>
            <Typography variant='body1bold'>
              Item Description from Seller
            </Typography>
            <Typography variant='body2'>
              Dell Emulex 10Gb Dual Port SFP PCIe Network Adapter Dell P/N:
              0DDF4D Tested Working
            </Typography>
          </Box>
          <Box aria-label='item-description' mt={2}>
            <Typography
              variant='body1bold'
              sx={{ textDecoration: 'underline' }}>
              Item Description
            </Typography>
            <Typography variant='body2' component={'span'}>
              {' '}
              Please carefully review the photos and details of the item before
              purchasing to avoid buying the incorrect item. Item is in good
              working condition unless otherwise stated. All product photographs
              have been taken by the Minnesota Computers team members for every
              listing, but the actual product you receive may not be the item
              photographed (for example, the item you receive may have a
              different serial number, but the same part number and all of the
              same parts are included). Any parts not photographed WILL NOT be
              included. Only what is photographed will be included in your
              purchase
            </Typography>
          </Box>
          <Box aria-label='money-back-guarantee' mt={2}>
            <Typography
              variant='body1bold'
              sx={{ textDecoration: 'underline' }}>
              30 Days Money Back Guarantee
            </Typography>
            <Typography variant='body2' component={'span'}>
              {' '}
              All items are tested or pulled from a working system. All
              shipments should arrive in functional condition and within a
              timely manner. If you do not receive your product or the product
              you receive is defective, we will refund your money within 30
              days. Cosmetic issues are not covered under the guarantee.
            </Typography>
          </Box>
          <Box aria-label='return-policy' mt={2}>
            <Typography
              variant='body1bold'
              sx={{ textDecoration: 'underline' }}>
              Warranty and Return Policy
            </Typography>
            <Typography variant='body2' component={'span'}>
              {' '}
              All products come with a 30-day warranty. We provide original
              stock photos. Cosmetic and compatibility problems do not fall
              under our warranty policy. If your return is authorized, please
              ensure you return it in the same condition and preferably the same
              packaging in which the item arrived. We will inspect the item and
              then refund the customer. If you are disappointed with your
              product, please reach out to us within 7 days of delivery. We must
              receive return/exchange items. Returns/refunds for any reason
              other than functionality or the item not matching the description
              are up to our discretion. Please contact us with any questions. We
              understand if you encounter any setbacks. We care about each buyer
              and strive to solve any problem in the best business manner.
            </Typography>
          </Box> */}
        </Paper>

        <ConfirmDialog
          title='Are you sure you want to delete'
          isOpen={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          {...dialogProps}
        />
      </Box>
    </>
  );
};

export default ItemView;
