# Hkube-Debug

Hkube-Debug is a mini Nodejs service for debuging algorithms on your computer while it's runing on Hkube cloud. This service was provided to us by Hkube team.
In this README i will only explain how to use/install it.

## Installation

```bash
npm install
```
In the mere chance everything was installed perfectly you can consider yourself the luckiest man alive and you can debug using "main" script command (as debug).

#### Possible Exceptions I Encountered
##### 1) When first running npm install
* errro - Somthing about "." in the wrong place
* solution - make sure you have 14.15.1 version of Node. In case you dont

Linux:
```bash
nvm install 14.15.1
```

Windows:
The best way i found is to remove Node completely and install [Node version 14.15.1](https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi) 

##### 2)
* errro - Somthing about vs building tools not found
* solution - Install vs building tools and set npm config to it

What worked for me:
I removed vs completely and install it again,restrating the computer and runing the following command
```bash
npm config set msvs_version 2017 --global
```
2017 - is the vs version

> MAKE SURE WHEN YOU ARE INSTALING TO INCLUDE THE NEEDED BUILDING TOOL

## usage
 1) Add debug entity on Hkube playground
 2) Copy the ws link to your code
 3) Require the desierd algorithm
 4) Start debuging