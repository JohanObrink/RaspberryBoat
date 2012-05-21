#include <iostream>
#include "UsbDevice.h"
#include "protocol.h"

using namespace std;

UsbDevice *pDevice;

int main()
{
    pDevice = new UsbDevice();
    pDevice->ConnectToDevice();

    u16 target = 0;

    cout << "Enter target: ";
    cin >> target;
    pDevice->SetTarget( 0, target );

    cout << "Enter target again: ";
    cin >> target;
    pDevice->SetTarget( 0, target );

    pDevice->Dispose();
    return 0;
}
