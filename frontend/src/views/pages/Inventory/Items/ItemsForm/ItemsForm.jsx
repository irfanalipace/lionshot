import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useFormik } from 'formik';

// import validationSchema from '../AddItemsForm/ValidationSchema';

import ItemDetails from './ItemDetails';
import { LoadingButton } from '@mui/lab';
import MarketPlaceStep from './MarketPlaceStep';
import ItemImagesForm from './ItemImagesForm';
import { Grid } from '@mui/material';
import ItemsFormStepper from './ItemsFormStepper';
import MUIButton from '../../../../Components/Button/MUIButton';
import { getAllMarketplacesApi } from '../../../../../core/api/marketplaces';
import notyf from '../../../../Components/NotificationMessage/notyfInstance';
import { useNavigate } from 'react-router-dom';
import { createItem, updateItems } from '../../../../../core/api/items';
import {
	mapErrorAccordingToFormik,
	mapObjectAccordingToPayload,
	mapResponseAccordingToFormik,
} from '../utils';
import { getAllCategoriesApi } from '../../../../../core/api/categories';
import { getAllBrandsApi } from '../../../../../core/api/brands';
import { getCondition } from '../../../../../core/api/condition';

export default function ItemsForm({ isEdit, data }) {
	const [activeStep, setActiveStep] = React.useState(isEdit ? 1 : 0);
	const [marketplaces, setMarketplaces] = useState([]);
	const [loading, setLoading] = useState(false);
	const [lists, setLists] = useState({
		categories: [],
		brands: [],
		conditions: [],
	});
	const navigate = useNavigate();

	async function getMarketPlaces() {
		try {
			setLoading(true);
			const { data } = await getAllMarketplacesApi();
			setMarketplaces(data.data);
		} catch (error) {}
		setLoading(false);
	}

	useEffect(() => {
		getMarketPlaces();
	}, []);
	const validationSchema = Yup.object().shape({
		item_details: Yup.object({
			title: Yup.string().required('Title is required'),
			description: Yup.string().required('Description is required'),
			item_id: Yup.string().required('Item is required'),
			asin: Yup.string().required('Asin is required'),
			sku: Yup.string().required('SKU is required'),
			mpn: Yup.string().required('Part Number is required'),
			quantity: Yup.string().required('Quantity is required'),
			cost: Yup.string().required('Cost is required'),
			brand_id: Yup.string().required('Brand is required'),
			category_id: Yup.string().required('Category is required'),
			selling_price: Yup.string().required('Selling Price is required'),
			condition_id: Yup.string().required('Condition is required'),
		}),
		marketplace: Yup.object({
			market_place_ids: Yup.array().min(1, 'Marketplace is required'),
		}),
		item_images: Yup.object({
			item_files: Yup.array()
				.min(1, 'Images are required')
				.max(5, 'Maximum 5 images are allowed'),
		}),
	});

	const fetchCategories = async () => {
		let response = await getAllCategoriesApi();

		setLists(prev => {
			return {
				...prev,
				categories: response.data?.data?.map(c => {
					return {
						value: c?.id,
						text: c.name,
					};
				}),
			};
		});
	};
	const fetchBrands = async () => {
		let response = await getAllBrandsApi();
		setLists(prev => {
			return {
				...prev,
				brands: response.data?.data?.map(c => {
					return {
						value: c?.id,
						text: c.name,
					};
				}),
			};
		});
	};
	const fetchConditions = async () => {
		let response = await getCondition();
		setLists(prev => {
			return {
				...prev,
				conditions: response.data?.data?.map(c => {
					return {
						value: c?.id,
						text: c.name,
					};
				}),
			};
		});
	};

	useEffect(() => {
		fetchBrands();
		fetchConditions();
		fetchCategories();
	}, []);

	const formik = useFormik({
		initialValues: {
			item_details: {
				title: data?.item_details?.title || '',
				item_id: data?.item_details?.item_id || '',
				asin: data?.item_details?.asin || '',
				mpn: data?.item_details?.mpn || '',
				item_type: data?.item_details?.item_type || '',
				description: data?.item_details?.description || '',
				quantity: data?.item_details?.quantity || '',
				bullet_points: data?.item_details?.bullet_points || [''],
				brand_id: data?.item_details?.brand_id || '',
				condition_id: data?.item_details?.condition_id || '',
				category_id: data?.item_details?.category_id || '',
				operating_system: data?.item_details?.operating_system || '',
				item_dimensions: {
					item_length: {
						value:
							data?.item_details?.item_dimensions?.item_length?.value || '',
						unit: data?.item_details?.item_dimensions?.item_length?.unit || '',
					},
					item_width: {
						value: data?.item_details?.item_dimensions?.item_width?.value || '',
						unit: data?.item_details?.item_dimensions?.item_width?.unit || '',
					},
					item_height: {
						value:
							data?.item_details?.item_dimensions?.item_height?.value || '',
						unit: data?.item_details?.item_dimensions?.item_height?.unit || '',
					},
				},
				package_dimensions: {
					package_length: {
						value:
							data?.item_details?.package_dimensions?.package_length?.value ||
							'',
						unit:
							data?.item_details?.package_dimensions?.package_length?.unit ||
							'',
					},
					package_width: {
						value:
							data?.item_details?.package_dimensions?.package_width?.value ||
							'',
						unit:
							data?.item_details?.package_dimensions?.package_width?.unit || '',
					},
					package_height: {
						value:
							data?.item_details?.package_dimensions?.package_height?.value ||
							'',
						unit:
							data?.item_details?.package_dimensions?.package_height?.unit ||
							'',
					},
				},
				sku: data?.item_details?.sku || '',
				cost: data?.item_details?.cost || '',
				selling_price: data?.item_details?.selling_price || '',
			},
			marketplace: {
				market_place_ids: data?.marketplace?.market_place_ids || [],
			},
			item_images: {
				item_files: data?.item_images.item_files || [],
			},
		},
		initialErrors: {
			item_details: { title: 'Required' },
			marketplace: { market_place_ids: 'Marketplace is required' },
		},
		// initialTouched: {
		// 	item_details: { title: 'Required' },
		// 	marketplace: { market_place_ids: 'Marketplace is required' },
		// },
		// validateOnChange: false,
		validationSchema: validationSchema,
		onSubmit: async values => {
			setLoading(true);
			try {
				if (isEdit) {
					const itemBody = { ...values, _method: 'PUT' };
					await updateItems(mapObjectAccordingToPayload(itemBody), data?.id);
					notyf.success('Item Updated Successfully');
					navigate('/items');
				} else {
					await createItem(mapObjectAccordingToPayload(values));
					notyf.success('Item Created Successfully');
					navigate('/items');
				}
			} catch (error) {
				setActiveStep(1);
				formik.setErrors(mapErrorAccordingToFormik(error?.data?.errors));
			}
			setLoading(false);
		},
	});

	useEffect(() => {
		if (isEdit) formik.setValues(data);
	}, [data]);
	const steps = {
		0: {
			label: 'Marketplace',
			key: 'marketplace',
			component: (
				<MarketPlaceStep
					formik={{
						...formik,
						values: formik.values?.marketplace,
						errors: formik.errors?.marketplace,
						touched: formik.touched.marketplace,
					}}
					marketplaces={marketplaces}
					loading={loading}
				/>
			),
		},
		1: {
			label: 'Item Details',
			key: 'item_details',
			component: (
				<ItemDetails
					formik={{
						...formik,
						values: formik.values?.item_details,
						errors: formik.errors?.item_details,
						touched: formik.touched?.item_details,
					}}
					lists={lists}
				/>
			),
		},
		2: {
			label: 'Images',
			key: 'item_images',
			component: (
				<ItemImagesForm
					formik={{
						...formik,
						values: formik.values?.item_images,
						errors: formik.errors.item_images,
						touched: formik.touched.item_images,
					}}
					files={formik.values?.item_images.item_files}
				/>
			),
			last: true,
		},
	};

	function isTabValid() {
		if (formik.errors[steps[activeStep].key] !== undefined) {
			if (Object.keys(formik.errors[steps[activeStep].key])?.length === 0) {
				return true;
			}
		} else if (formik.errors[steps[activeStep].key] === undefined) return true;
		else return false;
	}

	const handleNextAndSubmit = () => {
		if (isTabValid()) {
			if (!steps[activeStep].last) {
				setActiveStep(prevActiveStep => prevActiveStep + 1);
			} else formik.handleSubmit();
		}
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	return (
		<Paper
			sx={{
				width: '100%',
				height: '100%',
				padding: '1.5rem 2rem 2rem 2rem',
			}}
		>
			<ItemsFormStepper
				activeStep={activeStep}
				steps={steps}
				isStepFailed={!isTabValid()}
			/>
			<form onSubmit={formik.handleSubmit}>
				{steps[activeStep].component}
				{/* <ItemDetails formik={formik} /> */}
			</form>
			{steps[activeStep.last] ? (
				<>
					<Typography sx={{ mt: 2, mb: 1 }}>
						All steps completed - you&apos;re finished
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Box sx={{ flex: '1 1 auto' }} />
						{/* <Button onClick={handleReset}>Reset</Button> */}
					</Box>
				</>
			) : (
				<Grid container justifyContent='flex-end'>
					<MUIButton
						disabled={activeStep === 0 || loading}
						onClick={handleBack}
						sx={{ mr: 1, ...ButtonStyles }}
						variant={'outlined'}
					>
						Previous
					</MUIButton>

					<MUIButton
						onClick={handleNextAndSubmit}
						type='button'
						sx={ButtonStyles}
						disabled={loading || !isTabValid()}
					>
						{steps[activeStep].last ? 'Save & Publish' : 'Next'}
					</MUIButton>
				</Grid>
			)}
			{/* <Box
				style={{
					position: 'sticky',
					bottom: 0,
					left: 0,
					right: 0,
					width: '100%',
					zIndex: '1000',
				}}
			>
				<Paper elevation={10} sx={{ padding: '1rem 2.3rem' }}>
					<LoadingButton type='submit' variant='contained'>
						Submit
					</LoadingButton>
					<LoadingButton
						onClick={() => navigate('/items')}
						variant='outlined'
						sx={{ marginX: '.5rem' }}
					>
						Cancel
					</LoadingButton>
				</Paper>
			</Box> */}
		</Paper>
	);
}

const ButtonStyles = { width: '140px', height: '40px' };
