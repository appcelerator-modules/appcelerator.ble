const BLE = require('appcelerator.ble');
const IOS = (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad');

describe('appcelerator.ble', function () {
	if (IOS) {

		describe('PERIPHERAL_STATE_*', () => {
			it('PERIPHERAL_STATE_CONNECTED', () => {
				expect(BLE.PERIPHERAL_STATE_CONNECTED).toEqual(jasmine.any(Number));
			});

			it('PERIPHERAL_STATE_CONNECTING', () => {
				expect(BLE.PERIPHERAL_STATE_CONNECTING).toEqual(jasmine.any(Number));
			});

			it('PERIPHERAL_STATE_DISCONNECTED', () => {
				expect(BLE.PERIPHERAL_STATE_DISCONNECTED).toEqual(jasmine.any(Number));
			});

			it('PERIPHERAL_STATE_DISCONNECTING', () => {
				expect(BLE.PERIPHERAL_STATE_DISCONNECTING).toEqual(jasmine.any(Number));
			});
		});

		describe('AUTHORISATION_STATUS_*', () => {
			it('AUTHORISATION_STATUS_NOT_DETERMINED', () => {
				expect(BLE.AUTHORISATION_STATUS_NOT_DETERMINED).toEqual(jasmine.any(Number));
			});

			it('AUTHORISATION_STATUS_RESTRICTED', () => {
				expect(BLE.AUTHORISATION_STATUS_RESTRICTED).toEqual(jasmine.any(Number));
			});

			it('AUTHORISATION_STATUS_DENIED', () => {
				expect(BLE.AUTHORISATION_STATUS_DENIED).toEqual(jasmine.any(Number));
			});

			it('AUTHORISATION_STATUS_ALLOWED_ALWAYS', () => {
				expect(BLE.AUTHORISATION_STATUS_ALLOWED_ALWAYS).toEqual(jasmine.any(Number));
			});
		});

		describe('ATTRIBUTE_PERMISSION_*', function () {
			it('ATTRIBUTE_PERMISSION_READABLE', () => {
				expect(BLE.ATTRIBUTE_PERMISSION_READABLE).toEqual(jasmine.any(Number));
			});

			it('ATTRIBUTE_PERMISSION_WRITEABLE', () => {
				expect(BLE.ATTRIBUTE_PERMISSION_WRITEABLE).toEqual(jasmine.any(Number));
			});

			it('ATTRIBUTE_PERMISSION_READ_ENCRYPTION_REQUIRED', () => {
				expect(BLE.ATTRIBUTE_PERMISSION_READ_ENCRYPTION_REQUIRED).toEqual(jasmine.any(Number));
			});

			it('ATTRIBUTE_PERMISSION_WRITE_ENCRYPTION_REQUIRED', () => {
				expect(BLE.ATTRIBUTE_PERMISSION_WRITE_ENCRYPTION_REQUIRED).toEqual(jasmine.any(Number));
			});
		});

		describe('CHARACTERISTIC_PROPERTIES_*', function () {
			it('CHARACTERISTIC_PROPERTIES_BROADCAST', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_BROADCAST).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_READ', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_READ).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_WRITE_WITHOUT_RESPONSE', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_WRITE_WITHOUT_RESPONSE).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_WRITE', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_WRITE).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_NOTIFY', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_NOTIFY).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_INDICATE', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_INDICATE).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_AUTHENTICATED_SIGNED_WRITES', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_AUTHENTICATED_SIGNED_WRITES).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_EXTENDED_PROPERTIES', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_EXTENDED_PROPERTIES).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_NOTIFY_ENCRYPTION_REQUIRED', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_NOTIFY_ENCRYPTION_REQUIRED).toEqual(jasmine.any(Number));
			});

			it('CHARACTERISTIC_PROPERTIES_INDICATE_ENCRYPTION_REQUIRED', () => {
				expect(BLE.CHARACTERISTIC_PROPERTIES_INDICATE_ENCRYPTION_REQUIRED).toEqual(jasmine.any(Number));
			});
		});

		describe('CBUUID_*', function () {
			it('CBUUID_CHARACTERISTIC_EXTENDED_PROPERTIES_STRING', () => {
				expect(BLE.CBUUID_CHARACTERISTIC_EXTENDED_PROPERTIES_STRING).toEqual('2900');
			});

			it('CBUUID_CHARACTERISTIC_USER_DESCRIPTION_STRING', () => {
				expect(BLE.CBUUID_CHARACTERISTIC_USER_DESCRIPTION_STRING).toEqual('2901');
			});

			it('CBUUID_CLIENT_CHARACTERISTIC_CONFIGURATION_STRING', () => {
				expect(BLE.CBUUID_CLIENT_CHARACTERISTIC_CONFIGURATION_STRING).toEqual('2902');
			});

			it('CBUUID_SERVER_CHARACTERISTIC_CONFIGURATION_STRING', () => {
				expect(BLE.CBUUID_SERVER_CHARACTERISTIC_CONFIGURATION_STRING).toEqual('2903');
			});

			it('CBUUID_CHARACTERISTIC_FORMAT_STRING', () => {
				expect(BLE.CBUUID_CHARACTERISTIC_FORMAT_STRING).toEqual('2904');
			});

			it('CBUUID_CHARACTERISTIC_AGGREGATE_FORMAT_STRING', () => {
				expect(BLE.CBUUID_CHARACTERISTIC_AGGREGATE_FORMAT_STRING).toEqual('2905');
			});

			it('CBUUID_L2CAPPSM_CHARACTERISTIC_STRING', () => {
				expect(BLE.CBUUID_L2CAPPSM_CHARACTERISTIC_STRING).toEqual('ABDD3056-28FA-441D-A470-55A75A52553A');
			});
		});
	}
});
