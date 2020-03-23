#!/usr/bin/env python

import sys
import os
import re

devices = [
    {
        "name": "alsa_output.pci-0000_01_00.1.hdmi-stereo",
        "type": "speakers",
        "icon": ""
    },
    {
        "name": "alsa_output.usb-Logitech_PRO_X_000000000000-00.iec958-stereo",
        "type": "headphones",
        "icon": ""
    }
]

def get_device(device):
    for iteration in devices:
        if (iteration["name"] == device["name"]):
            return {"id": device["id"], "name": device["name"], "type": iteration["type"], "icon": iteration["icon"]}

    return "Device not found"

def get_default_sink():
    stream = os.popen("pacmd list-sinks | grep -e 'name:' -e 'index:'")
    output = stream.read()

    default_sink_match = re.findall(r'\* index: (\d+?).*?\n.*?name: <(.*?)>', output)
    if (len(default_sink_match) < 1):
        return "Default sink not set"

    return {"id": default_sink_match[0][0], "name": default_sink_match[0][1]}

def get_sink(device):
    stream = os.popen("pacmd list-sinks | grep -e 'name:' -e 'index:'")
    output = stream.read()

    sink_match = re.findall(r'(?!\*) index: (\d+?).*?\n.*?name: <({})>'.format(device["name"]), output)
    if (len(sink_match) < 1):
        return "Sink not found"

    return {"id": sink_match[0][0], "name": sink_match[0][1]}

def move_streams(sink):
    stream = os.popen("pacmd list-sink-inputs | grep -e 'index:'")
    output = stream.read()

    indexes = re.findall(r'index: (\d+?)', output)

    for index in indexes:
        os.system("pacmd move-sink-input {0} {1}".format(index, sink["id"]))

def set_default_sink(new_sink, previous_sink):
    os.system("pacmd set-default-sink {}".format(new_sink["name"]))

    move_streams(new_sink)
    #os.system("pacmd move-sink-input {0} {1}".format(previous_sink["id"], new_sink["id"]))

def main(args):
    default_sink = get_default_sink()
    device = get_device(default_sink)

    if (len(args) > 0 and args[0] == "--toggle"):
        if (type(device) is dict):
            temp = list.copy(devices)

            for item in temp:
                if item["name"] != device["name"]:
                    sink = get_sink(item)
                    set_default_sink(sink, device)

        else:
            print(device)

    else:
        if (type(device) is dict):
            print(device["icon"]) 
        else:
            print(device)

main(sys.argv[1:])

