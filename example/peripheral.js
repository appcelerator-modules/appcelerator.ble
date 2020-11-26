/* eslint-disable no-alert */

function deviceWin(peripheral, centralManager, BLE, serviceUUID, characteristicUUID) {
	var logs = [];
	// Central event for peripheral connection
	centralManager.addEventListener('didConnectPeripheral', function (e) {
		logs.push('Connected to Peripheral');
		setData(logs);
		registerEvents(e.peripheral);
		peripheral.discoverServices();
	});

	centralManager.addEventListener('didDisconnectPeripheral', function (e) {
		Ti.API.info('Disconnected from Peripheral: ' + e.peripheral.name + ' with UUID: ' + e.peripheral.uuid);
		logs.push('Peripheral Disconnected');
		setData(logs);
		global.charactersticObject = null;
		global.serviceObject = null;
	});

	centralManager.addEventListener('didFailToConnectPeripheral', function (e) {
		Ti.API.info('didFailToConnectPeripheral');
		Ti.API.info(e.peripheral);
		Ti.API.info(e.error.localizedDescription);
		Ti.API.info('Fail to connect with Peripheral - error code ' + e.errorCode + ' error domain: ' + e.errorDomain + ' error description ' + e.errorDescription);
		logs.push('did Fail To Connect Peripheral');
		setData(logs);
	});

	// Configure UI
	var deviceWindow = Ti.UI.createWindow({
		backgroundColor: 'white',
		title: 'Device information',
		titleAttributes: { color: 'blue' }
	});
	var navDeviceWindow = Ti.UI.iOS.createNavigationWindow({
		window: deviceWindow
	});

	var backButton = Titanium.UI.createButton({
		top: 100,
		title: 'Go to device list'
	});
	backButton.addEventListener('click', function () {
		navDeviceWindow.close();
	});

	var nameLabel = Ti.UI.createLabel({
		color: 'black',
		top: 140,
		width: 250,
		font: { fontSize: 14 },
		text: 'Name - ' + peripheral.name
	});
	var uuidLabel = Ti.UI.createLabel({
		color: 'blue',
		top: 170,
		width: 250,
		font: { fontSize: 11 },
		text: 'UUID - ' + peripheral.address
	});

	var connectButton = Titanium.UI.createButton({
		top: 200,
		title: 'Connect'
	});
	var disConnectButton = Titanium.UI.createButton({
		top: 250,
		title: 'Disconnect'
	});
	var subscribeButton = Titanium.UI.createButton({
		top: 300,
		title: 'Subscribe to Heart Rate (2A37)'
	});
	var unsubscribeButton = Titanium.UI.createButton({
		top: 350,
		title: 'Unsubscribe'
	});

	var valueField = Ti.UI.createTextField({
		top: 400,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_BEZEL,
		hintText: 'Enter Value',
		hintTextColor: '#000000',
		backgroundColor: '#fafafa',
		color: 'black',
		width: 250,
		height: 40
	});

	var writeValue = Titanium.UI.createButton({
		top: 450,
		title: 'Write Value'
	});

	var tableView = Titanium.UI.createTableView({
		top: 500,
		scrollable: true,
		backgroundColor: 'White',
		separatorColor: '#DBE1E2',
		bottom: '5%',
	});
	var tbl_data = [];
	function setData(list) {
		tbl_data.splice(0, tbl_data.length);
		if (list.length > 0) {
			var initalValue = list.length - 1;
			for (var i = initalValue; i >= 0; i--) {
				var btDevicesRow = Ti.UI.createTableViewRow({
					height: 50,
					row: i,
					hasChild: true
				});
				var uuidLabel = Ti.UI.createLabel({
					left: 5,
					right: 5,
					color: 'blue',
					top: 5,
					font: { fontSize: 11 },
					text: list[i]
				});
				btDevicesRow.add(uuidLabel);
				tbl_data.push(btDevicesRow);
			}
		}
		tableView.setData(tbl_data);
	}
	setData(logs);

	navDeviceWindow.add(connectButton, backButton, nameLabel, uuidLabel, disConnectButton, subscribeButton, unsubscribeButton, tableView, valueField, writeValue);

	// Buttoon click events
	writeValue.addEventListener('click', function () {
		if (global.charactersticObject) {
			var data = valueField.value === '' || valueField.value === null ? 'temp data' : valueField.value;
			var buffer = Ti.createBuffer({ value: data });
			// Characteristic needs to have write permission & property
			peripheral.writeValueForCharacteristic({
				data: buffer,
				characteristic: global.charactersticObject,
				type: BLE.CHARACTERISTIC_TYPE_WRITE_WITHOUT_RESPONSE
			});
		} else {
			alert('No heart rate characteristic (2A37) available to write value');
		}
	});

	connectButton.addEventListener('click', function () {
		if (!peripheral) {
			logs.push('No peripheral available to connect');
			setData(logs);
			return;
		}
		if (peripheral.isConnected) {
			logs.push('Peripheral already connect');
			setData(logs);
			return;
		}

		centralManager.connectPeripheral({
			peripheral: peripheral,
			options: { [BLE.CONNECT_PERIPHERAL_OPTIONS_KEY_NOTIFY_ON_CONNECTION]: true, [BLE.CONNECT_PERIPHERAL_OPTIONS_KEY_NOTIFY_ON_DISCONNECTION]: true }
		});
	});

	disConnectButton.addEventListener('click', function () {
		if (peripheral) {
			centralManager.cancelPeripheralConnection({ peripheral: peripheral });
		} else {
			alert('No peripheral available to disconnect');
		}
	});

	subscribeButton.addEventListener('click', function () {
		if (peripheral) {
			if (peripheral.isConnected) {
				if (global.charactersticObject) {
					peripheral.subscribeToCharacteristic({
						characteristic: global.charactersticObject
					});
				} else {
					alert('Heart Rate Characteristic (2A37) Not found');
				}
			} else {
				alert('Peripheral is not connected. Click \'Connect\'');
			}
		} else {
			alert('No peripheral available to discover service');
		}
	});

	unsubscribeButton.addEventListener('click', function () {
		if (global.charactersticObject) {
			peripheral.unsubscribeFromCharacteristic({
				characteristic: global.charactersticObject
			});
		} else {
			alert('No registered characteristic available to unsubscribe');
		}
	});

	function registerEvents(connectedPeripheral) {
		connectedPeripheral.addEventListener('didDiscoverServices', function (e) {
			Ti.API.info('didDiscoverServices ' + e);
			if (e.errorCode !== null) {
				alert('Error while discovering services' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
			let discoverServicePeripheral = e.sourcePeripheral;
			discoverHeartRateServices(discoverServicePeripheral);
		});

		connectedPeripheral.addEventListener('didDiscoverCharacteristics', function (e) {
			Ti.API.info('didDiscoverCharacteristics');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				alert('Error while discovering characteristic' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
			let discoverCharacteristicPeripheral = e.sourcePeripheral;
			discoverHeartRateCharacteristic(discoverCharacteristicPeripheral);// Subscribe To Characteristic
		});

		connectedPeripheral.addEventListener('didUpdateNotificationStateForCharacteristics', function (e) {
			Ti.API.info('didUpdateNotificationStateForCharacteristics');
			if (e.errorCode !== null) {
				alert('Error while subscribing characteristic' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
			let characteristic = e.characteristic;
			if (characteristic.isNotifying === true) {
				logs.push('subscribed for Heart Rate (2A37)');
			} else {
				logs.push('unsubscribed for Heart Rate (2A37)');
			}
			setData(logs);
		});

		connectedPeripheral.addEventListener('didUpdateValueForCharacteristic', function (e) {
			if (e.errorCode !== null) {
				alert('Error while didUpdateValueForCharacteristic' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
			Ti.API.info('ValueForCharacteristic ' + e.value);
			const buffer = e.value;
			if (buffer) {
				var firstBitValue = buffer[0] & 0x01;
				if (firstBitValue === 0) {
					// Heart Rate Value Format is in the 2nd byte
					logs.push('Value from Peripheral Manager: ' + buffer[1]);
				} else {
					// Heart Rate Value Format is in the 2nd and 3rd bytes
					logs.push('Value from Peripheral Manager: ' + ((buffer[1] << 8) +  buffer[2]));
				}
				setData(logs);
			}
		});

		connectedPeripheral.addEventListener('didDiscoverDescriptorsForCharacteristics', function (e) {
			Ti.API.info('didDiscoverDescriptorsForCharacteristics');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				Ti.API.info('Error while discovering descriptors for characteristics' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
		});

		connectedPeripheral.addEventListener('didDiscoverIncludedServices', function (e) {
			Ti.API.info('didDiscoverIncludedServices');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				alert('Error while discovering included services' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
		});

		connectedPeripheral.addEventListener('didReadRSSI', function (e) {
			Ti.API.info('didReadRSSI');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				alert('Error while reading RSSI' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
		});

		connectedPeripheral.addEventListener('didUpdateValueForDescriptor', function (e) {
			Ti.API.info('didUpdateValueForDescriptor');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				alert('Error while updating value for descriptor' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
		});

		connectedPeripheral.addEventListener('didWriteValueForCharacteristic', function (e) {
			Ti.API.info('didWriteValueForCharacteristic');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				alert('Error while write value for characteristic ' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
		});

		connectedPeripheral.addEventListener('didWriteValueForDescriptor', function (e) {
			Ti.API.info('didWriteValueForDescriptor');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				alert('Error while write value dor descriptor' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
		});

		connectedPeripheral.addEventListener('didUpdateName', function (e) {
			Ti.API.info('didUpdateName');
			Ti.API.info(e);
		});

		connectedPeripheral.addEventListener('didModifyServices', function (e) {
			Ti.API.info('didModifyServices');
			Ti.API.info(e);
		});

		connectedPeripheral.addEventListener('peripheralIsReadyToSendWriteWithoutResponse', function (e) {
			Ti.API.info('peripheralIsReadyToSendWriteWithoutResponse');
			Ti.API.info(e);
		});

		connectedPeripheral.addEventListener('didOpenChannel', function (e) {
			Ti.API.info('didOpenChannel');
			Ti.API.info(e);
			if (e.errorCode !== null) {
				alert('Error while opening channel' + e.errorCode + '/' + e.errorDomain + '/' + e.errorDescription);
				return;
			}
		});
	}

	function discoverHeartRateServices (sourcePeripheral) {
		var services;

		// sourcePeripheral is the peripheral sending the didDiscoverServices event
		services = sourcePeripheral.services;
		Ti.API.info('services ' + services);
		services.forEach(function (service) {
			Ti.API.info('Discovered service ' + service.UUID);
			if (service.uuid === serviceUUID) {
				global.serviceObject = service;
				Ti.API.info('Found heart rate service!');
				logs.push('Found heart rate service!');
				setData(logs);
				sourcePeripheral.discoverCharacteristics({
					service: service
				});
			}
		});
	}

	function discoverHeartRateCharacteristic (sourcePeripheral) {
		var characteristics;
		characteristics = global.serviceObject.characteristics;
		Ti.API.info('characteristics ' + characteristics);
		characteristics.forEach(function (characteristic) {
			Ti.API.info('Discovered characteristic ' + characteristic.UUID);
			if (characteristic.uuid === characteristicUUID) {
				global.charactersticObject = characteristic;
				Ti.API.info('Found heart rate characteristic, will subscribe...');
				logs.push('Found heart rate characteristic!');
				setData(logs);
			}
		});
	}
	return navDeviceWindow;
}
exports.deviceWin = deviceWin;
