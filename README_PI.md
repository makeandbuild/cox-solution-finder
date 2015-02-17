# Configuration of the Raspberry Pi

## 1.0 - Booting and Logging into the Pi

*NOTE: If you do not already have an operating system installed on a microsd card you may [download and install Raspbian](http://www.raspberrypi.org/downloads/) from the [Raspberry Pi website](http://www.raspberrypi.org/).*

1.1 Assemble the Pi by inserting the MicroSD card, Ethernet cable, WiFi adapter, HDMI cable, input devices, and power cord into their respective jacks.

1.2 Attach the HDMI cable to a monitor, and power up the Pi.

1.3 If this is the first time to boot the Pi, a program called `raspi-config` will run. See the [documentation](http://elinux.org/RPi_raspi-config) for info on `raspi-config`. Otherwise, exit the program.

1.4 Once the Pi has finished booting, log in with the default user `pi` abd default password `raspberry`.

1.5 If necessary, [install and mount an external usb drive](http://www.raspberrypi.org/forums/viewtopic.php?t=38429).

1.6 Run `sudo raspi-config'.
  1.6.1 Select "Expand Filesystem".
  1.6.2 Select "Overclock". Change to "Turbo".
  1.6.3 Select "Advanced Options". Select "Memory Split". Change value to 16.


## 2.0 - WiFi Configuration

2.1 Install `hostapd`:

	sudo apt-get install hostapd

2.2 Edit /etc/network/interfaces and make the following changes

a. Comment out or remove the line `wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf`

b. Change wlan0 to the following for a static IP address:
	
	iface wlan0 inet static
    address 10.1.10.1
    netmast 255.255.255.0

2.3 Edit `/etc/default/hostapd` and add the following:

	DAEMON_CONF="/etc/hostapd/hostapd.conf"

2.4 Install `hostapd`:

	sudo apt-get install bridge-utils hostapd

2.5 Copy the `hostapd.conf` file from the root of this project to `/etc/hostapd/hostapd.conf`

2.6 Download and install the updated driver:

	wget http://www.daveconroy.com/wp3/wp-content/uploads/2013/07/hostapd.zip
	unzip hostapd.zip 
	sudo mv /usr/sbin/hostapd /usr/sbin/hostapd.bak
	sudo mv hostapd /usr/sbin/hostapd.edimax 
	sudo ln -sf /usr/sbin/hostapd.edimax /usr/sbin/hostapd 
	sudo chown root.root /usr/sbin/hostapd 
	sudo chmod 755 /usr/sbin/hostapd

2.7 Reboot:

	sudo reboot

When the Pi finishes rebooting, there will be an access point labeled `RaspAP` with the passphrase `raspberry`. Connecting to this WAP will give a device access to the webserver.

## 3.0 - Software Installation

3.1 Update the OS:

	sudo apt-get update
	sudo apt-get upgrade

3.2 Install MongoDB:

There is an installation script for installing MongoDB on the Raspberry Pi. Clone the directory, then install and start the MongoDB server:

	git clone https://github.com/svvitale/mongo4pi.git && cd mongo4pi
	sudo ./install.sh
	sudo service mongod start

3.4 Install NodeJS:

	wget http://node-arm.herokuapp.com/node_latest_armhf.deb
	sudo dpkg -i node_latest_armhf.deb

3.5 Clone the project:

	git clone https://github.com/maxmedia/cox-solution-finder.git && cd cox-solution-finder

3.6 Install node dependencies (this may take a while):

	npm install

3.7 Start the app:

	npm start

4.0 TODO: Install process manager (pm2) and use it to start the app
