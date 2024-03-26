# Shopper: E-commerce Project

Welcome to Shopper, a MERN (MongoDB, Express.js, React.js, Node.js) stack-based e-commerce project. This project aims to provide a comprehensive platform for both customers and administrators to interact with an online marketplace. Below you'll find essential information to get started with the project.

## Features

1. **User Authentication:** Shopper provides secure user authentication for customers to save their carts.
2. **Product Management:** Administrators can add, edit, and delete products through the admin dashboard.
3. **Shopping Cart:** Customers can add products to their cart and proceed to checkout securely.
4. **Responsive Design:** The frontend is designed to be responsive, ensuring a seamless experience across different devices.

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB

### Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/shopper.git
   ```

2. **Install Dependencies:**

   Navigate to the project directory and install backend and frontend dependencies separately:

   ```bash
   cd shopper/backend
   npm install
   cd ../frontend
   npm install
   cd ../admin
   npm install
   ```

3. **Set Up Environment Variables:**

   In the backend directory, create a `.env` file and add the following environment variables:

   ```.env
   PORT=4000
   MONGODB_URI=your_mongodb_uri
   SECRET_KEY=your_secret_key
   ```

   Replace `your_mongodb_uri` with your MongoDB connection string and `your_secret_key` with a secret key for JWT token generation.

4. **Run the Application:**

   Start the backend server:

   ```bash
   cd ../backend
   npm start
   ```

   Start the frontend server:

   ```bash
   cd ../frontend
   npm run dev
   ```

   Start the admin server:

   ```bash
   cd ../admin
   npm run dev
   ```

5. **Access the Application:**

   Once both servers are running, you can access the application in your browser:

   - Frontend: <http://localhost:5173/>
   - Admin Dashboard: <http://localhost:5174/>

### Project Structure

- **backend/**: Contains the backend codebase built with Node.js, Express.js, and MongoDB.
- **frontend/**: Contains the frontend codebase built with React.js.
- **admin/**: Contains the admin frontend codebase built with React.js.

### Contributing

Contributions are welcome! If you'd like to contribute to Shopper, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/myfeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/myfeature`).
5. Create a new Pull Request.

### Acknowledgements

- This project was inspired by various e-commerce platforms and tutorials available online.
- Special thanks to the open-source community for their contributions to the technologies used in this project.
