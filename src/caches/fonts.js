import toolbox from 'sw-toolbox';

import precache from '../utils/precache';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: `next:fonts:${fontsVersion}`,
		maxEntries: 5
	}
};

precache(
	fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`),
	{ name: cacheOptions.cache.name, maxEntries: cacheOptions.cache.maxEntries, maxAge: -1 }
);

// fonts route
toolbox.router.get('/build/v2/files/o-fonts-assets@:version/:font.woff', toolbox.cacheFirst, cacheOptions);
