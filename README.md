<a name="readme-top"></a>

<h1 align="center">
  <img src="/src/assets/images/icon.png" style="width:60px; vertical-align: middle;"/>
  <span style="display: inline-block; vertical-align: middle;">PCBUILD3R</span>
</h1>

<p align="center">
  <i align="center">Computer hardware e-commerce platform featuring virtual PC assembly simulation 🪛</i>
</p>

<!-- TODO: Replace with DEMO GIF -->
<p align="center">
  <img src="/src/assets/readme images/homepage.png"/>
</p>

## Table Of Content

- [About The Project](#about-the-project)
    - [Showcase](#showcase)
    - [Features](#features)
    - [Built With](#built-with)
- [Getting Started](#getting-started)
    - [Folder Structure](#folder-structure)
    - [Pre-requisites](#pre-requisites)
    - [Installation](#prerequisites)
    - [Setting Up](#setting-up)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About The Project

Disclaimer: This is a website used for the purpose of Final Year Project (FYP). PCBUILD3R aims to elevate hardware proficiency through 3D simulation and comprehensive guideline on PC building. It offers features such as 3D simulation, hardware browsing, rewards redemption, inventory management and more. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.8.

### Showcase

| Homepage | Simulation Intro | Simulation  | Shop |
:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/homepage.png" title="Homepage" width="100%" crossorigin> | <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/intro_simulation.png" title="Simulation Intro" width="100%" crossorigin> | <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/simulation.png" title="Simulation" width="100%" crossorigin> | <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/shop.png" title="Shop" width="100%" crossorigin> |

| Product Detail | Shopping Cart | Admin Dashboard | Manage Inventory |
:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/product_detail.png" title="Product Detail" width="100%" crossorigin> | <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/shopping_cart.png" title="Shopping Cart" width="100%" crossorigin> | <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/admin_dashboard.png" title="Admin Dashboard" width="100%" crossorigin> | <img src="https://media.githubusercontent.com/media/Vincexodus/PCBuild3R/main/src/assets/readme images/manage_inventory.png" title="Manage Inventory" width="100%" crossorigin> |

### Features

* Stey By Step Virtual PC Assembling Simulation
* Rewards Redemption
* Hardware Product Browsing
* Manage Shopping Cart
* View Order History & Leave Product Rating
* Inventory Management

### Built With

* [![MongoDB]][MongoDB-url]
* [![Express.js]][Express.js-url]
* [![Angular]][Angular-url]
* [![Node.js]][Node.js-url]
* [![Three.js]][Three.js-url]

## Getting Started

To get started, you first need to understand the project folder structure for installations.

### Folder Structure

    ├── DB Dump                      # MongoDB Dummy Schema Document
    ├── backend                      # Node JS, MongoDB and Express JS server folder
    ├── src                          # Angular website folder with 3D model and image assets
    ├── .editorconfig
    ├── .gitignore
    ├── README.md
    └── LICENSE.txt

### Pre-requisites

Make sure that you have the following prerequisites installed
* [MongoDB Compass](https://www.mongodb.com/try/download/compass)
* [Node.js](https://nodejs.org/en/download/)

### Installation

1. Create an free API Key at [Resend](https://resend.com)
2. Clone the repo and install dependencies for front end (angular project)
   ```sh
   git clone https://github.com/Vincexodus/PCBuild3R.git && cd PCBUILD3R && npm install
   ```
3. Locate to backend directory and install dependencies
   ```sh
   cd backend
   npm i # /backend
   ```
4. Replace your resend API key in `.env.local` of `/backend` directory. Rename the file to `.env`
   ```js
   const RESEND_API_KEY='your_resend_api_key';
   ```

### Setting Up

1. In root directory, run `ng serve`, navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
2. Open a new IDE window, locate to backend directory and run `nodemon app.js`. Backend is ready when `Connected to MongoDB successfully...` is shown in terminal.
3. Open MongoDB Compass and navigate to users collection of PCBUILD3R database to import data. In users collection, `add data >> Import JSON or CSV file >> PCBUILD3R.users.json`. The json file is located in `/DB Dump`.
4. Imported admin email `admin@gmail.com`, password `admin123`. Customer email `customer1@gmail.com`, password `customer1`. Repeat Step 3 for productCategory and product collection.

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

* [Build a Task Manager Application From Scratch](https://www.youtube.com/watch?v=V-CeWkz1MNQ&list=PLIjdNHWULhPSZFDzQU6AnbVQNNo1NTRpd)
* [3D Models From SketchFab](https://sketchfab.com)
* [Click and Drag 3d models in ThreeJS](https://dev.to/calebmcolin/how-to-interactively-drag-3d-models-in-threejs-5a7h#:~:text=A%29%20Moving%20individual%20objects%20%28Object3D%29%201%201%29%20Create,Create%20a%20function%20to%20drag%20the%20object%20)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)


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