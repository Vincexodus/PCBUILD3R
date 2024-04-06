<a name="readme-top"></a>

# PCBUILD3R

A computer hardware e-commerce website built using the MEAN stack.

<img src="/src/assets/images/PCBUILD3R.png"/>

<p align="center">
  <a href="#about-the-project">About</a> &nbsp;&bull;&nbsp;
  <a href="#getting-started">Getting Started</a> &nbsp;&bull;&nbsp;
  <a href="#built-with">Built With</a>
</p>

## Table Of Content

- [About The Project](#about-the-project)
    - [Aim](#aim)
    - [Features](#features)
    - [Built With](#built-with)
- [Getting Started](#getting-started)
    - [Folder Structure](#folder-structure)
    - [Installation](#prerequisites)
    - [Setting Up](#setting-up)
    - [Development Server](#development-server)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About The Project

Disclaimer: This is a demo project used for the purpose of Final Year Project (FYP). PCBUILD3R aims to elevate hardware proficiency through 3D simulation and comprehensive guideline on PC building.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.8.

### Aim

* To aid consumers in defining their preferences in PC building in terms of budget, purpose, performance, and design.
* To offer consumers personalized build recommendations, recommending them the hardware components based on their needs.
* To provide immersive and enjoyable learning experience by leveraging elements of gamification such as 3D simulation and reward system.
* To nurture a mutually beneficial situation where users get to acquire valuable skills while platform focuses on user engagement and revenue generation.

### Features

* Build recommendations.
* Provide specifications of suitable hardware for given budget and demand.
* 3D simulation.
* Hardware browsing.
* Rewards redemption.
* Stey by step guide on PC building, from choosing parts to setting up.
* Provides 3D playground for users to build PC virtually.

### Built With

* [![MongoDB]][MongoDB-url]
* [![Express.js]][Express.js-url]
* [![Angular]][Angular-url]
* [![Node.js]][Node.js-url]
* [![Three.js]][Three.js-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get started, you need to understand the project folder structure for installations.

### Folder Structure

    ├── DB Dump                      # MongoDB Schema Document/json files
    ├── backend                      # Node JS MongoDB and Express JS server folder
    ├── src                          # Angular website folder
    ├── .editorconfig
    ├── .gitignore
    ├── README.md
    └── LICENSE.txt

### Installation

There are couple things required before setting up the project. 
* Install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
* npm
  ```sh
  npm install npm@latest -g
  ```

### Setting Up

1. Create an free API Key at [Resend](https://resend.com)
2. Clone the repo
   ```sh
   git clone https://github.com/Vincexodus/PCBuild3R.git
   ```
3. Locate to root directory & install NPM packages
   ```sh
   # root
   npm install
   ```
4. Locate to backend directory & install NPM packages
   ```sh
   cd backend
   # /backend
   npm install
   ```
4. Replace your resend API key in `.env.local`
   ```js
   const RESEND_API_KEY='your_resend_api_key';
   ```

### Development server

1. In root directory, run command below, then navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
   ```sh
   # root
   ng serve
   ```
2. Duplicate IDE window, locate to backend directory
   ```sh
   # /backend
   nodemon app.js
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Implement wishlist feature
<!-- - [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish -->

See the [open issues](https://github.com/Vincexodus/PCBuild3R/issues) for a full list of proposed features (and known issues).

## Contributing

Any contributions are **greatly appreciated**. If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/newFeature`)
3. Commit your Changes (`git commit -m 'Add some newFeature'`)
4. Push to the Branch (`git push origin feature/newFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE][license-url] for more information.

## Acknowledgements

I've included a few materials that have helped me complete this project

* [Pharmacy Management System](https://github.com/LalanaChami/Pharmacy-Mangment-System/blob/master/backend/middleware/check-auth.js)
* [Build a Task Manager Application From Scratch](https://www.youtube.com/watch?v=V-CeWkz1MNQ&list=PLIjdNHWULhPSZFDzQU6AnbVQNNo1NTRpd)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Choose an Open Source License](https://choosealicense.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express.js-url]: https://expressjs.com/
[Angular]: https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: https://nodejs.org/en
[Three.js]: https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white
[Three.js-url]: https://threejs.org/
[LICENSE-url]: https://github.com/Vincexodus/PCBuild3R/blob/main/LICENSE