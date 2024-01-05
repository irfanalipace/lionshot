import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { SET_HASH } from '../store/hashRouter/hashSlice';
const useHash = () => {
	const loc = useLocation();
	// console.log('111 loc', loc);
	// const hashValue = useSelector(state => state.hashRouter.hash);
	// const dispatch = useDispatch();
	const [hash, setHash] = useState();

	useEffect(() => {
		// setHash(hashValue);
		// function handleHashChange(e) {
		// console.log('111 handleHashChange');
		setHash(loc.hash);
		// setHash(loc)
		// }
		// window.addEventListener('popstate', handleHashChange);
		// return () => {
		//   window.removeEventListener('popstate', handleHashChange);
		// };
	}, [loc.hash]);

	const updateHash = value => {
		// dispatch(SET_HASH({ hash: value }));
		location.hash = value;
	};

	return [hash, updateHash];
};

export default useHash;
