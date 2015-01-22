# Configuration of the Raspberry Pi

## 1.0 - Booting and Logging into the Pi

*NOTE: If you do not already have an operating system installed on a microsd card you may [download and install Raspbian](http://www.raspberrypi.org/downloads/) from the [Raspberry Pi website](http://www.raspberrypi.org/).*

1.1 Assemble the Pi by inserting the MicroSD card, Ethernet cable, WiFi adapter, HDMI cable, input devices, and power cord into their respective jacks.

1.2 Attach the HDMI cable to a monitor, and power up the Pi.

1.3 If this is the first time to boot the Pi, a program called `raspi-config` will run. See the [documentation](http://elinux.org/RPi_raspi-config) for info on `raspi-config`. Otherwise, exit the program.

1.4 Once the Pi has finished booting, log in with the default user `pi` abd default password `raspberry`.

1.5 If necessary, [install and mount an external usb drive](http://www.raspberrypi.org/forums/viewtopic.php?t=38429).

## 2.0 - TODO: WiFi Configuration

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