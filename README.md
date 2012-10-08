#Raspberry boat
[![Build Status](https://secure.travis-ci.org/JohanObrink/RaspberryBoat.png?branch=master)](http://travis-ci.org/JohanObrink/RaspberryBoat)

#Platform
Raspbian (Debian Wheezy)

##Required installs

###GPS drivers

    apt-get install gpsd
    apt-get install gpsd-client

###Modem settings

    wvdialconf

###libusb

    apt-get install libusb-dev
    
###Node
    install latest nodejs and npm
    cd node && npm install

###Video (uses video4linux2)

    git clone https://github.com/indev/v4l2jpeg.git && cd v4l2jpeg
    make
    sudo make install

###GPIO

    Download @ http://pypi.python.org/pypi/RPi.GPIO
    Check out python scripts for inspiration. To use them as is, you have to solder everything identically.
    
###Start up sequence

    sudo cp other/rc.local.template /etc/rc.local
    edit file if gpio or any other part differs from ours... ie: edit file if(true)
    

##Parts

1. [Raspberry Pi](http://www.raspberrypi.org/)
2. Boat [Kyosho Sunstorm 600 v2](http://www.kyosho.com/eng/products/rc/detail.html?product_id=107423)
3. GPS Reciever [USGlobalSat BU-353](http://www.usglobalsat.com/p-62-bu-353-w.aspx)
4. Camera [Creative Live! Cam Socialize HD](http://www.creative.com/mylivecam/products/product.aspx?catID=1&pid=19008)
5. Servo controller [Pololu Micro Maestro 6-Channel USB Servo Controller](http://www.pololu.com/catalog/product/1350)
6. Powered USB Hub [Deltaco UH-1302](https://www.deltaco.se/products/items/itemid/\(UH-1302\)/index.aspx)
7. 3G Modem [Huawei E1820](https://www.google.com/search?q=huawei+e1820)

##Debugging
If anything goes wrong - in any way imaginable - except for when the boat is on fire - the problem is ALLWAYS that the
amps are to low. If the boat IS on fire, the amps are to high and in the wrong place; decrease and rewire.