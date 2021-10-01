import DisconnectDialog from './views/disconnectDevice.vue';

import { EventEmitter } from 'events';
import { connect } from 'http2';

let deviceEvents = new EventEmitter ();

let device_module = null;

let studio = null;
let workspace = null;
let devices = [];

let Devices = [];

let connections = {};

function loadDevice ()
{
        try
        {
                /* Any module that will allow you to find the type of device you have chosen */

                return require ('device_module');
        }
        catch (e)
        {
                studio.workspace.error ('device: is not available '+e.message);
                return {
                        list: function ()
                        {
                                return [
                                ];
                        }
                };
        }
}

async function listDevice ()
{
        let ports = [];
        try
        {
                ports = await device_module.list ();
        }
        catch (e)
        {
                studio.workspace.error ('device: failed to list '+e.message);
        }
        return ports;
}

function updateDevices()
{
        workspace.updateDevices ([...devices, ...Devices]);
}

function search ()
{
        if(!discoverDevicesTimer)
        {
                discoverDevicesTimer = setInterval (async () => {
                        let devices = await listDevice ();
                        devices = [];
                        for(let Device of devices)
                        {
                                /* Search only for the devices that have the same specifications as your Awesome Device, array and set its properties.*/

                                devices.push(Device);
                        }
                        updateDevices ();
                },5000);
        }
}

export function setup (options, imports, register)
{
        studio = imports;
        device_module = loadDevice();
        search();

		let Device =  {
			defaultIcon ()
		{
    		 return 'plugins/device.prueba/data/img/icons/ESP.png';
		},
		registerForUpdate (device, fn)
		{
        	deviceEvents.on ('update:'+device.id, fn);
        	return () => deviceEvents.removeListener ('update:'+device.id, fn);
		},
		getConnections ()
		{
       	 let connections = [];
        	for (let deviceId in connections)
        	{
                connections.push (connections[deviceId].device);
       		}
        	return connections;
		},

		connect(device, options)
		{
        /* Aca se pondria la conexión al port de studio-supervisor*/

        setTimeout(() => {
                device.status = 'CONNECTED';
        }, 1000);
		},

		disconnect(device, options)
		{
        /* Aca se pondria el codigo para terminar el codigo de studio-supervisor */ 

        setTimeout(() => {
                device.status = 'DISCONNECTED';
        }, 1000);
		}


		}

		workspace = studio.workspace.registerDeviceDriver('devicePrueba', Device);

		if (workspace){
			workspace.registerDeviceToolButton('DEVICE_RUN', 10, async () => {
				let device = studio.workspace.getDevice ();
		
				/* Here goes the actual code that will make your device run a project */
				console.log('Run');
				}, 'plugins/device.prueba/data/img/icons/run.png',
		
				/* The aditional options that make the Run Button visible and enabled only if there is a connected device
				and its type is "awesome" */
				{
						visible () {
								let device = studio.workspace.getDevice ();
								return (device.status === 'CONNECTED' && device.connection === 'awesome');
						},
						enabled () {
								let device = studio.workspace.getDevice ();
								return (device.status === 'CONNECTED' && device.connection === 'awesome');
						},
						type: 'run'
				});

				register(null, {
					Device
			});

		}


        
}