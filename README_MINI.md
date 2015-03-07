# Configuration of the Raspberry Pi

## Booting and Logging into the Pi

*NOTE: If you do not already have an operating system installed on a microsd card you may [download and install Raspbian](http://www.raspberrypi.org/downloads/) from the [Raspberry Pi website](http://www.raspberrypi.org/).*

* Assemble the Pi by inserting the MicroSD card, Ethernet cable, WiFi adapter, HDMI cable, input devices, and power cord into their respective jacks.

* Attach the HDMI cable to a monitor, and power up the Pi.

* If this is the first time to boot the Pi, a program called `raspi-config` will run. See the [documentation](http://elinux.org/RPi_raspi-config) for info on `raspi-config`. Otherwise, exit the program.

* Once the Pi has finished booting, log in with the default user `pi` abd default password `raspberry`.

* If necessary, [install and mount an external usb drive](http://www.raspberrypi.org/forums/viewtopic.php?t=38429).

* Run `sudo raspi-config`.

  * Select "Expand Filesystem".

  * Select "Advanced Options". Select "Memory Split". Change value to 16.


## WiFi Configuration

* Install `hostapd`:

	          sudo apt-get install hostapd

* Edit /etc/network/interfaces and make the following changes

  * Comment out or remove the line `wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf`

  * Change wlan0 to the following for a static IP address:

	          iface wlan0 inet static
              address 10.1.10.1
              netmast 255.255.255.0

  * Edit `/etc/default/hostapd` and add the following:

            DAEMON_CONF="/etc/hostapd/hostapd.conf"

* Install `hostapd`:

	          sudo apt-get install bridge-utils hostapd

* Copy the `hostapd.conf` file from the root of this project to `/etc/hostapd/hostapd.conf`

* Download and install the updated driver:

	          wget http://www.daveconroy.com/wp3/wp-content/uploads/2013/07/hostapd.zip
	          unzip hostapd.zip
	          sudo mv /usr/sbin/hostapd /usr/sbin/hostapd.bak
	          sudo mv hostapd /usr/sbin/hostapd.edimax
	          sudo ln -sf /usr/sbin/hostapd.edimax /usr/sbin/hostapd
	          sudo chown root.root /usr/sbin/hostapd
	          sudo chmod 755 /usr/sbin/hostapd

* Reboot:

	          sudo reboot

When the Pi finishes rebooting, there will be an access point labeled `RaspAP` with the passphrase `raspberry`. Connecting to this WAP will give a device access to the webserver.

## Software Installation

* Update the OS:

	          sudo apt-get update
	          sudo apt-get upgrade

* Install MongoDB:

There is an installation script for installing MongoDB on the Raspberry Pi. Clone the directory, then install and start the MongoDB server:

	          git clone https://github.com/svvitale/mongo4pi.git && cd mongo4pi
	          sudo ./install.sh
	          sudo service mongod start

* Install NodeJS:

	          wget http://node-arm.herokuapp.com/node_latest_armhf.deb
	          sudo dpkg -i node_latest_armhf.deb

* Clone the project:

	          git clone https://github.com/maxmedia/cox-solution-finder.git && cd cox-solution-finder

* Install node dependencies (this may take a while):

	          npm install

* Write .env file. The following are the required, non-API keys that must be present for the app to perform correctly.

            NODE_ENV=production
            SOLUTION_MODE=showroom

* Start the app:

	          npm start

* TODO: Install process manager (pm2) and use it to start the app



## Repl

If you want to play around, you can use the node repl.

			cd <project root>
			node
      require('dotenv').load();
			var keystone = require('keystone');
			keystone.set('module root', path.resolve(path.dirname()));
			require('./setup')(keystone)
