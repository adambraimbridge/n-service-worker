
// note because flags don't exist on first page view
// if flag === false can clear cache
// if flag === undefined can put in cache but not retrieve
// if flag === true can put and retrieve from cache
let flags = {}; //eslint-disable-line

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'flagsUpdate') {
		flags = Object.freeze(msg.flags);
	}
});

self.addEventListener('activate', () => {
	// do some stuff to enable/disable caches and other features based on value of current flags
});

export function get (name) {
	return flags[name]
}
