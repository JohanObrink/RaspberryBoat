#ifndef CONSOLE

#include <v8.h>
#include <node.h>

#include "UsbDevice.h"
#include "protocol.h"

using namespace v8;
using namespace node;

UsbDevice *pDevice = NULL;

static Handle<Value> ping(const Arguments& args)
{
    return String::New("pong");
}

static Handle<Value> connect(const Arguments& args)
{
    pDevice = new UsbDevice();

    if( pDevice->ConnectToDevice() )
    {
        return String::New("Connected to device");
    }
    return String::New("Failed to connect");
}

static Handle<Value> disconnect(const Arguments& args)
{
    if ( pDevice != NULL )
    {
        pDevice->Dispose();
        delete pDevice;
        pDevice = NULL;
    }
    return String::New("1");
}

static Handle<Value> setTarget(const Arguments& args)
{
    if ( pDevice != NULL )
    {
        pDevice->SetTarget( args[0]->NumberValue(), args[1]->NumberValue() );
    }
    return String::New("1");
}

extern "C" {
    static void init(Handle<Object> target)
    {
        NODE_SET_METHOD(target, "ping", ping);
        NODE_SET_METHOD(target, "connect", connect);
        NODE_SET_METHOD(target, "disconnect", disconnect);
        NODE_SET_METHOD(target, "setTarget", setTarget);
    }

    NODE_MODULE(usbmaestro, init);
}

#endif
