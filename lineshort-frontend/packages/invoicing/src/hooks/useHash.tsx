import { useEffect, useState } from 'react';

const useHash = () => {
	const [hash, setHash] = useState<any>(window.location.hash);

	const handleHashChange = () => {
		setHash(window.location.hash);
	};
	useEffect(() => {
		// Add the event listener
		window.addEventListener('hashchange', handleHashChange);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	}, []);
	const updateHash = (value) => {
		if (history.pushState) {
			history.pushState(null, null, value);
		} else {
			location.hash = value;
		}
		setHash(value);
	};
	if (hash && !location.hash) updateHash('');

	return [hash, updateHash];
};

export default useHash;
