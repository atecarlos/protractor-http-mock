module.exports = [
	{
		request: {
			path: '/users',
			method: 'GET'
		},
		response: {
			data: [
				{
					firstName: 'multiple',
					lastName: 'from file'
				}
			]
		}
	},
	{
		request: {
			path: '/groups',
			method: 'GET'
		},
		response: {
			data: [
				{ name: 'file first' },
				{ name: 'file second' }
			]
		}
	}
];
			