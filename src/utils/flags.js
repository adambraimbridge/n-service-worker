import idb from 'idb';

let dbPromise;

function openDb () {
	return idb.open('next-flags', 1, updateDb => {
		updateDb.createObjectStore('flags');
	});
}

function getDb () {
	if (!dbPromise) {
		dbPromise = openDb();
	}
	return dbPromise;
}

let lastUpdated = 0;
let flags = {};

function getLatestFlags () {
	return getDb()
		.then(db => {
			const tx = db.transaction('flags');
			return tx.objectStore('flags').get('flags');
		})
		.then(latestFlags => {
			flags = latestFlags;
			lastUpdated = Date.now();
		});
}

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'flagsClobber') {
		lastUpdated = 0;
		ev.ports[0].postMessage('success');
	}
});

export async function getFlag (name) {
	if (Date.now() - lastUpdated > 5000) {
		await getLatestFlags();
	}
	return flags && flags[name];
}
