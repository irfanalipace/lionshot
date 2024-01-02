import React from 'react';

// yup  / formik
import * as Yup from 'yup';
import { useFormik } from 'formik';

// mui
// import PageWrapper from '../../../Components/PageWrapper/PageWrapper'
import {
	Box,
	Button,
	Container,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	Stack,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// import EstimateTitle from './NewEstimateTitle';
// import
// EstimateFormTitle,
// NewEstimateFormLayout,
// NewEstimateMainLayout,
//  NewEstimateFooterLayout,
//  NewEstimateAddNewContactLayout,
// './NewEstimateStyles';
import FormField from '@/Components/InputField/FormField';
import useResponsiveStyles from '@/hooks/useMedaiQuery';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// import NewEstimateAddRow from "./NewEstimateAddRow";
// import NewEstimateTopForm from "./NewEstimateTopForm";
// import NewEstimateFormTotal from "./NewEstimateFormTotal";
// import AddNewContact from "./AddNewContact";
// import NewEstimateFooter from "./NewEstimateFooter";
import AddItem from './AddItem/AddItem';

export const NewEstimateFormTitle: React.FC = styled(Typography)(
	({ theme }) => ({
		fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
		margin: '1rem 0 .4rem 0',
	})
);

export const AddRowTitle: React.FC = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0',
}));

const NewEstimate = () => {
	const [formValues, setFormValues] = useState(null);

	// //  formik/ new estimate
	// const initialValues = {
	//   sub_total: 0,
	//   discount: 0,
	//   discount_type: "Percentage",
	//   shipping_charges: 0,
	//   adjustment: 0,
	//   items_rates_are: "tax_inclusive",
	//   total: 0,

	//   estimate_items: [
	//     {
	//       item_id: Date.now().toString(),
	//       item_name: "Type or click to select an item",
	//       quantity: 1,
	//       rate: 0,
	//       item_tax: 0,
	//       amount: 0,
	//     },
	//   ],
	// };

	//  formik/ new estimate
	const initialValues = {
		adjustment: 231.0,
		discount: 3233,
		discount_type: 'Dollar',
		estimate_items: [
			{
				item_id: '2',
				item_name: 'Kenneth Wolff',
				quantity: 1,
				rate: 37529,
				item_tax: 'Non-Taxable',
				amount: 37529,
			},
			{
				item_id: '2',
				item_name: 'Kenneth Wolff',
				quantity: 1,
				rate: 37529,
				item_tax: 'Non-Taxable',
				amount: 37529,
			},
			{
				item_id: '5',
				item_name: 'Mr. Marquis Rolfson',
				quantity: 2,
				rate: 11773,
				item_tax: 'Non-Taxable',
				amount: 23546,
			},
			{
				item_id: '1',
				item_name: 'Mrs. Jacynthe Bode',
				quantity: 2,
				rate: 24712,
				item_tax: 'Non-Taxable',
				amount: 49424,
			},
			{
				item_id: '2',
				item_name: 'Kenneth Wolff',
				quantity: 1,
				rate: 37529,
				item_tax: 'Non-Taxable',
				amount: 37529,
			},
			{
				item_id: '5',
				item_name: 'Mr. Marquis Rolfson',
				quantity: 3,
				rate: 11773,
				item_tax: 'Non-Taxable',
				amount: 35319,
			},
		],
		items_rates_are: 'tax_inclusive',
		shipping_charges: '233.00',
		sub_total: '284161.00',
		total: '281392.00',
	};

	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: (values) => {
			// Handle form submission
			console.log(values);
		},
	});

	const handleFieldChange = (fieldName, value) => {
		setFormValues((prevValues) => ({
			...prevValues,
			[fieldName]: value,
		}));
	};

	return (
		<>
			<p>dfd</p>
		</>
	);
};

export default NewEstimate;
