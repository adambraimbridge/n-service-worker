import router from '../utils/router';;

import { fastest } from '../utils/handlers';

const options = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: 'polyfill',
		maxEntries: 4
	}
};

// use toolbox.fastest as we want to send requests to check last-modified headers for polyfill
router.get('/polyfill/*', fastest, options);
