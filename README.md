# 3D_File_Labeler
This is an application that takes in a folder of obj files, displays the 3D object onto the screen, then exports the label data as json file.

## If you don't have ubuntu bash on Windows
Follow this link to download ubuntu bash (I got Ubuntu on Windows store):
https://itsfoss.com/install-bash-on-windows/

### If you want to change root directory
1. Open ubuntu bash and type
```bash
$ cd~
$ vim .bashrc
```
2. Go to the end of the file using page down button and 
   change "cd ~" with your desired location such as "cd /mnt/c".

## Install express
```bash
$ npm install express
```
## Install php
```bash
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install php
$ sudo apt-get install php7.2-cli
$ sudo apt-get install hhvm
```
### Check if php is installed
```bash
$ php -v
```
## Start php server in 'Code' dir
```bash
$ cd Code
$ php -S localhost:8000
```
## Go to localhost:8000/sice/form.html
http://localhost:8000/form.html

### Make sure you select a folder with ONLY .json files
### Select json folder FIRST then obj folder
