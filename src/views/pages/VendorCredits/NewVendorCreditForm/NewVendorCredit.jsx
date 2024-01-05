import {
	Box,
	Grid,
	InputAdornment,
	Paper,
	Stack,
	TextField,
} from '@mui/material';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomSelect from '../../../Components/Select/Select';
import CustomerContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import CustomDrawer from '../../../Components/Drawer/Drawer';
import CustomerSearchModel from '../../CreditMemo/NewCreditMemo/CustomerSearchModel';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import MUIButton from '../../../Components/Button/MUIButton';
import FormField from '../../../Components/InputField/FormField';
import SettingsIcon from '@mui/icons-material/Settings';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import {
	decryptId,
	formatDateToYYYYMMDD,
} from '../../../../core/utils/helpers';
import { useParams } from 'react-router-dom';
import CopyModel from './CopyModel';
import BillTemplateDrawer from './BillTemplateDrawer';
import CustomerViewDrawer from '../../../Components/CustomerViewDrawer/CustomerViewDrawer';
import CustomerSelection from '../../../Components/CustomerSelection';
import { billSingleApi } from '../../../../core/api/bills';
import {
	GetVendorCreditBills,
	ViewVendorCredit,
	createVendorCredit,
	deleteVendorCreditApi,
	updateVendorCredit,
} from '../../../../core/api/vendorcredits';
import AddItem from './AddItem';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { getTaxesApi } from '../../../../core/api/vendor';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import NewVendorCreditHeader from './NewVendorCreditHeader';

const NewVendorCredit = ({ edit }) => {
	const { id } = useParams();
	const decryptedID = decryptId(id);
	const [openModel, setOpenModel] = useState(false);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [billView, setBillView] = useState(false);
	const [open, setOpen] = useState(false);
	const [venderLoading, setVenderLoading] = useState(false);
	const [selectBill, setSelectBill] = useState();

	const [bill_Item, setBill_Item] = useState([]);
	const [venderCreditState, setVenderCreditState] = useState([]);
	const [billList, setBillList] = useState([]);
	const [btnType, setBtnType] = useState('');
	const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
	const initialValues_ = {
		vendor_id: '',
		bill_id: '',
		vendor_credit_number: '',
		rmi_number: '',
		vendor_credit_date: formatDateToYYYYMMDD(new Date()),
		vendor_credit_files: [],
		vendor_credit_items: [
			{
				//	isChecked: false,
				item_id: '',
				item_name: 'Type or click to select an item',
				quantity: 1,
				rate: 0,
				tax_amount: 0,
				tax_id: 1,
				total: 1,
			},
		],
	};

	const validationSchema = Yup.object().shape({
		vendor_id: Yup.number().required('Vendor Name is required'),
		bill_id: Yup.number().required('Bill Number is required'),
		vendor_credit_number: Yup.string().required(
			'Vendor credit Number is required'
		),
		vendor_credit_date: Yup.string().required('Vendor credit Date is required'),
		vendor_credit_items: Yup.array()
			.min(1, 'Please select at least one item.')
			.test(
				'is-not-empty',
				'Please select at least one item.',
				value => value && value.length > 0
			),
	});

	const formik = useFormik({
		initialValues: initialValues_,
		validationSchema: validationSchema,
		onSubmit: async values => {
			if (edit && decryptedID) {
				try {
					const vals = {
						...values,
						button_type: btnType,
						_method: 'PUT',
					};
					const resp = await updateVendorCredit(vals, decryptedID);
					notyf.success(resp?.message);
					navigate('/vendor-credits');
				} catch (err) {
					//notyf.error(err?.data?.message);
					if (
						typeof err?.data?.errors === 'object' &&
						err?.data?.errors !== null
					) {
						formik.setErrors(err.data.errors);
					} else {
						console.log('values updateCreditMemoAPI err', err?.message);
					}
				} finally {
					/* empty */
				}
			} else {
				try {
					const vals = {
						...values,
						button_type: btnType,
					};
					const resp = await createVendorCredit(vals);
					notyf.success(resp?.message);
					navigate('/vendor-credits');
				} catch (err) {
					//		notyf.error(err?.data?.message);
					if (
						typeof err?.data?.errors === 'object' &&
						err?.data?.errors !== null
					) {
						formik.setErrors(err.data.errors);
					} else {
						console.log('values createCreditMemo err', err?.message);
					}
				} finally {
					/* empty */
				}
			}
		},
	});
	const navigate = useNavigate();
	const handleButtonClick = type => {
		setBtnType(type);
	};
	useGenerateNumber(
		'vendor_credit',
		'vendor_credit_number',
		formik,
		edit,
		decryptedID
	);

	const onSelect = resp => {
		if (resp?.id) {
			fetchVendorCreditBills(resp.id);
		}
	};

	const fetchVendorCreditBills = async _id => {
		try {
			const responce = await GetVendorCreditBills(_id);
			setBillList(responce?.data);
		} catch (e) {
			console.log('e', e);
		}
	};
	// const deletingFile = fileId => {
	// 	setVendorCreditFiles(prevFiles => prevFiles.filter(f => f !== fileId));
	// };

	const deletingFile = fileId => {
		if (fileId.id) {
			deleteVendorCreditApi(fileId?.id);
		} else {
			formik.setFieldValue(
				'vendor_credit_files',
				formik.values?.vendor_credit_files.filter(f => f !== fileId)
			);
			notyf.success('File Deleted');
		}
	};

	const [pastedImage, setPastedImage] = useState(null);

	const handlePaste = event => {
		const items = (event.clipboardData || event.originalEvent.clipboardData)
			.items;
		for (let item of items) {
			if (item.type.indexOf('image') !== -1) {
				const file = item.getAsFile();
				const reader = new FileReader();

				reader.onload = () => {
					const imageData = reader.result;
					setPastedImage(imageData);
				};

				reader.readAsDataURL(file);
			}
		}
	};

	const handleBillChange = async invId => {
		if (invId !== undefined) {
			const resp = await billSingleApi(invId);
			if (edit === undefined) {
				setVenderCreditState(resp);
			} else if (edit) {
				setBill_Item(resp?.bill_item);
			}
		}
	};

	useEffect(() => {
		let inv = billList?.find(row => row?.id === formik?.values?.bill_id);
		if (inv) {
			if (edit) {
				handleBillChange(inv?.id);
				setSelectBill({
					label: inv?.bill_number,
					value: inv?.id,
				});
				formik.setFieldValue('bill_id', inv?.id);
			}
		}
	}, [billList]);

	useEffect(() => {
		if (edit === undefined) {
			setSelectBill({
				value: null,
				label: '',
			});
			//		formik.setFieldValue('bill_id', "");
		}
	}, [formik?.values?.vendor_id]);

	useEffect(() => {
		const fetchForm = async () => {
			if (decryptedID) {
				setVenderLoading(true);

				const resp = await ViewVendorCredit(decryptedID);
				if (resp && resp?.data) {
					setVenderCreditState(resp?.data);
					formik.setValues(resp?.data);
					//	setVenderLoading(false);
				}
			}
		};
		fetchForm();

		//get Tax API start
		const respTax = getTaxesApi();
		respTax
			?.then(data => {
				const repsTax = data?.data;
				const updatedOptions_ = repsTax?.map(({ id, name, rate }) => ({
					value: id,
					label: name,
					price: rate,
				}));
				//		setTexValues(updatedOptions_);
			})
			.catch(error => {
				console.error(error?.message);
			});
	}, [decryptedID]);

	useEffect(() => {
		if (formik.dirty === true) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);
	return (
		<>
			<OverlayLoader open={isLoadingOverlay} />
			<form onSubmit={formik.handleSubmit}>
				<div style={{ position: 'relative' }}>
					<NewVendorCreditHeader
						title={edit ? 'Edit Vendor Credits' : 'New Vendor Credits'}
					>
						<Paper sx={{ width: '100%', padding: '1.5rem 2rem 10rem 2rem' }}>
							<CustomerSelection
								id='vendor_id'
								formik={formik}
								type='vendor'
								preSelected={formik.values?.vendor_id}
								onSelect={onSelect}
								customerPreSelect={formik.values?.customer_delivered_id}
								setIsLoadingOverlay={setIsLoadingOverlay}
							/>
							<>
								<Grid item container mt={2}>
									<Grid item xs={2} display='flex' alignItems='center'>
										<InputLabel>
											Bill#<span style={{ color: 'red' }}>*</span>
										</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<CustomSelect
											id='bill_id'
											placeholder='Select Bill'
											touched={formik.touched?.bill_id}
											isDisabled={edit}
											value={selectBill}
											options={billList?.map(item => ({
												label: item.bill_number,
												value: item.id,
											}))}
											onChange={selected => {
												setSelectBill({
													value: selected?.value,
													label: selected?.label,
												});
												handleBillChange(selected.value);
												formik.setFieldValue('bill_id', selected.value);
											}}
											error={
												formik.touched?.bill_id &&
												formik.errors?.bill_id &&
												formik.errors.bill_id
											}
											isSearchable
										/>
									</Grid>
								</Grid>
								{/* {formik.values.bill && (
							<Grid item container>
								<Grid item xs={2} sx={{ ...labelStyle }}></Grid>
								<Grid item xs={4}>
									<Button
										startIcon={<RemoveRedEye />}
										onClick={() => setBillView(true)}
									>
										View Bills
									</Button>
								</Grid>
							</Grid>
						)} */}
								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel>
											Vendor Credit#<span style={{ color: 'red' }}>*</span>
										</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<FormField
											name='vendor_credit_number'
											value={formik.values.vendor_credit_number}
											onChange={formik.handleChange}
											size='small'
											disabled={true}
											isTouched={formik.touched?.vendor_credit_number}
											error={
												formik.touched?.vendor_credit_number &&
												formik.errors?.vendor_credit_number &&
												formik.errors?.vendor_credit_number
											}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<SettingsIcon />
													</InputAdornment>
												),
											}}
										/>
									</Grid>
								</Grid>
								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel>RMA#</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<FormField
											name='rmi_number'
											value={
												formik.values.rmi_number
												// ? formik.values.rmi_number
												// : formik.values.vendor_credit_number
											}
											onChange={formik.handleChange}
											size='small'
											isTouched={formik.touched?.rmi_number}
											error={
												formik.touched?.rmi_number &&
												formik.errors?.rmi_number &&
												formik.errors?.rmi_number
											}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<SettingsIcon />
													</InputAdornment>
												),
											}}
										/>
									</Grid>
								</Grid>
								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel>
											Vendor Credit Date<span style={{ color: 'red' }}>*</span>
										</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<FormField
											type='date'
											name='vendor_credit_date'
											value={formik.values.vendor_credit_date}
											onChange={formik.handleChange}
											size='small'
											inputProps={{
												min: formatDateToYYYYMMDD(new Date()),
											}}
											isTouched={formik.touched?.vendor_credit_date}
											error={
												formik.touched?.vendor_credit_date &&
												formik.errors?.vendor_credit_date &&
												formik.errors?.vendor_credit_date
											}
										/>
									</Grid>
								</Grid>
							</>

							{/* add row comp  */}
							<>
								{/* total calcaultion section  */}
								{/* <NewEstimateFormTotal /> */}
								<Grid
									item
									container
									sx={{ marginTop: '2rem' }}
									display='flex'
									justifyContent='flex-end'
								>
									{/* left section .. empty */}
									<Grid item xs={12} md={6}>
										{/* <Typography>Right Side</Typography> */}
									</Grid>

									<Grid item container spacing={1} mt={1}>
										<Grid item sm={12}>
											<AddItem
												initialValues={initialValues_}
												formik={formik}
												isEdit={edit}
												venderCreditState={venderCreditState}
												bill_Item={bill_Item}
												loading={venderLoading}
												setLoading={setVenderLoading}
											/>
										</Grid>
										<Grid item xs={6}>
											<Grid item xs={12}>
												<InputLabel>Vendor Notes</InputLabel>
												<TextField
													fullWidth
													//		label='Notes'
													multiline
													rows={3}
													id='notes'
													value={formik.values.notes}
													onChange={formik.handleChange}
													// variant="outlined"
												/>
											</Grid>
										</Grid>
										<Grid
											item
											xs={6}
											display='flex'
											justifyContent='center'
											mt={1}
										>
											<Box
												sx={{
													width: '60%',
												}}
											>
												<FilesModule
													files={formik.values?.vendor_credit_files}
													onDelete={deletingFile}
													setFiles={files =>
														formik.setFieldValue('vendor_credit_files', files)
													}
												/>
											</Box>
										</Grid>
									</Grid>
								</Grid>
							</>

							{/* add new email/contact section  */}
							{/* {customerList?.id && ( */}
							<CustomerContactsList
							// setSelectedEmails={setSelectedEmails}
							// gettingVendorList={gettingVendorList}
							// selectedEmails={selectedEmails}
							// customerList={customerList}
							// // emails={formik?.values?.email_to}
							/>
							{/* )} */}
						</Paper>

						<Box
							style={{
								position: 'fixed',
								bottom: 0,
								width: '83.2%',
								zIndex: 9,
							}}
						>
							<Paper elevation={5}>
								<Grid container style={{ padding: '0 1rem 1.2rem 1rem' }}>
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
												onClick={() => handleButtonClick('save_as_draft')}
												//			  disabled={saveAsDraftLoading}
												//			  loading={saveAsDraftLoading}
												variant='contained'
											>
												Save as Draft
											</LoadingButton>
											<LoadingButton
												variant='contained'
												type='submit'
												onClick={() => handleButtonClick('save_and_send')}
												//		  disabled={saveAndSendLoading}
												//		  loading={saveAndSendLoading}
											>
												Save and send
											</LoadingButton>
											<MUIButton variant='outlined' router to='/vendor-credits'>
												Cancel
											</MUIButton>
										</Stack>
									</Grid>
								</Grid>
							</Paper>
						</Box>
					</NewVendorCreditHeader>
				</div>
				<CustomDrawer
					open={openDrawer}
					onClose={() => setOpenDrawer(false)}
					dWidth
				>
					<CustomerViewDrawer
						onClose={() => setOpenDrawer(false)}
						// customerList={customerList}
					/>
				</CustomDrawer>
				<CustomDrawer open={billView} onClose={() => setBillView(false)}>
					<BillTemplateDrawer />
				</CustomDrawer>
				<CopyModel
					open={openModel}
					onClose={() => setOpenModel(false)}
					handlePaste={handlePaste}
					pastedImage={pastedImage}
				/>
				<CustomerSearchModel open={open} onClose={() => setOpen(false)} />
			</form>
		</>
	);
};

export default NewVendorCredit;
