<h1 align="center">Photo Gallery Display App v3.1.0</h1>
<br>

## About The Project

I have an old iPad mini and found that it was too old to use anymore. The operating system wouldnt update anymore therefore rendering it useless at downloading new apps. Therefore I wanted to repurpose it by making a photo gallery app. This is why I created a Node.js application that allows my iPad to display the images stored within the application. Furthermore, the app accompanies a client controller which allows my family and others to control and add images to the application. Overall this project is fun and interesting and gives my iPad a whole new purpose in its life.

## How it works
Within the Node.js application there are 3 main components.
- The server (stores the images and controls the main application and viewer)
- The controller (allows user communication with the server to control the application)
- The viewer (the display for the application)

Here is a diagram of how this application works:

![Diagram](https://github.com/umarraj008/Photo-Gallery-Display-App/blob/main/ProjectImages/diagram.png?raw=true)


## Built With

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)


## Getting Started

To get started first extract the Photo-Gallery-Display-App.zip.  

Then in CMD cd to the directory:
```
cd Photo-Gallery-Display-App
```
Now you can run the application::
```
npm start
```
Clients must use the hosts IP address and port 3030 to access web pages:

> [!TIP]
> Use `ipconfig` in CMD to find host ip for windows

```
// Example
http://192.168.1.1:3030/

// Default endpoint is client controller
http://<host IP>:3030/

// Viewer endpoint is for display view
http://<host IP>:3030/viewer

// Admin endpoint is for admin controller
http://<host IP>:3030/admin
```

<!-- ## Roadmap -->


## License

Distributed under the GNU GPL v3 License. See LICENSE.txt for more information.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)


## Contact

Email - umar.rajput02@gmail.com  
Website - [umarrajput.co.uk](umarrajput.co.uk)  
GitHub - [@umarraj008](https://github.com/umarraj008)  
LinkedIn - [in/umar-rajput](https://www.linkedin.com/in/umar-rajput/)   
Project Link: https://github.com/umarraj008/Photo-Gallery-Display-App
