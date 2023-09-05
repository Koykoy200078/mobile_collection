// DeviceSupport.js
export const isDeviceSupported = (deviceName) => {
	const supportedDevices = [
		'M2-202',
		'M2-203',
		'M2-Pro',
		'S1-701',
		'S1-702',
		'D1p-601',
		'D1p-602',
		'D1p-603',
		'D1p-604',
		'D1w-701',
		'D1w-702',
		'D1w-703',
		'D1w-704',
		'D4-501',
		'D4-502',
		'D4-503',
		'D4-504',
		'D4-505',
		'M2-Max',
		'D1',
		'D1-Pro',
		'Swift 1',
		'I22T01',
	]

	return supportedDevices.includes(deviceName)
}
