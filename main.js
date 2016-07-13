export default flags => {
	if ('serviceWorker' in navigator) {
		if (flags.get('serviceWorker')) {
			navigator.serviceWorker
				.register('/__sw.js')
				.then(registration => {
					console.log(registration);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
