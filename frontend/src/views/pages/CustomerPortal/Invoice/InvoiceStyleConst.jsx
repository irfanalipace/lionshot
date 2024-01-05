import MenuItem from '@mui/base/MenuItem';
import { classes as menuItemClasses } from '@mui/base/MenuItem';
import styled from '@mui/system/styled';
import { MenuButton } from '@mui/base/MenuButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useResponsiveStyles from '../../../../core/hooks/useMedaiQuery';
// import useResponsiveStyles from './hooks/useMedaiQuery';
export var StyledListbox = styled('ul')(function (_a) {
	var theme = _a.theme;
	return '\n    font-family: roboto;\n    font-size:18px,\n    min-width: 100px;\n    border-radius: 12px;\n    overflow: auto;\n    outline: 0px;\n    background: white;\n    box-shadow: 0px 4px 30px #d0d7de;\n    z-index:1\n    ';
});
export var StyledMenuItem = styled(MenuItem)(function (_a) {
	var theme = _a.theme;
	return '\n    padding: 13px;\n    border-radius: 8px;\n    cursor: pointer;\n    .MuiSvgIcon-root {\n      color: #2196F3;\n      margin-bottom:-5px;\n      font-size: 20px;\n      margin-right: 8px;\n    }\n    &:hover:not(.'.concat(
		menuItemClasses.disabled,
		') {\n      background-color: #F6FBFF;\n    }\n    '
	);
});
export var TriggerButton = styled(MenuButton)(function (_a) {
	var theme = _a.theme;
	return '\n    // padding: 2px;\n    background: #2196F3;\n    color: #fff;\n    border-radius:18px;\n    border:none;\n    transition-duration: 120ms;\n    .MuiSvgIcon-root {\n      margin-bottom: -3px;\n    }\n    &:hover {\n      border-color: rgb(242, 242, 242);\n    }\n    ';
});
export var HeaderMenuButton = styled(MenuButton)(function (_a) {
	var theme = _a.theme;
	return '\n    padding: 7px 10px;\n    border-radius:8px;\n    border:none;\n    transition-duration: 120ms;\n    &:hover {\n      border-color: rgb(242, 242, 242);\n    }\n    ';
});
export var headerIconButton = {
	backgroundColor: '#EEEEEE',
	border: '1px solid #d1d1d1',
	borderRadius: '4px 0px 0px 0px',
	textTransform: 'none',
	fontSize: '14px',
};
export var headerMenuBox = {
	display: 'flex',
	alignItems: 'center',
};
export var MainTitleStyled = styled(Paper)(function (_a) {
	var theme = _a.theme;
	return {
		width: '100%',
		padding: '20px 40px',
		display: 'flex',
		justifyContent: 'flex-end',
		border: '8px',
	};
});
export var NewEstimateFormTitle = styled(Typography)(function (_a) {
	var theme = _a.theme;
	return {
		fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	};
});
export var FieldTitle = styled(Typography)(function (_a) {
	var theme = _a.theme,
		fontWeight = _a.fontWeight;
	return {
		fontSize: useResponsiveStyles().upMedium ? '16px' : '.6rem',
		margin: '1rem 0 .4rem 0',
		fontFamily: 'Roboto',
		fontWeight: fontWeight || 400,
	};
});
export var AddRowTitle = styled(Typography)(function (_a) {
	var theme = _a.theme;
	return {
		fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
		margin: '1rem 0',
	};
});
export var FormMainTitle = styled(Typography)(function (_a) {
	var theme = _a.theme,
		margin = _a.margin;
	return {
		fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
		fontWeight: 600,
		margin: margin ? '.4rem 0' : undefined, // Use conditional rendering for margin
	};
});
//# sourceMappingURL=InvoiceStyleConst.jsx.map
