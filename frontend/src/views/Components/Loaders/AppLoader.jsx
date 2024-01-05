import React from 'react';
import logo from '../../../assets/images/logos/computer.png';
function AppLoader() {
	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<img src={logo} />
		</div>
	);
}

export default AppLoader;
