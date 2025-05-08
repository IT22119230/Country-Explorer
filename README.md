[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# Country Explorer - React + Redux App

This project is a React-based frontend application integrated with Redux Toolkit for state management. It allows users to browse, search, and filter countries using the REST Countries API, and includes user authentication and favorites functionality. The app also features unit and component tests using Jest and React Testing Library.

---

## 🚀 Features

### 🌍 Countries

* **Fetch All Countries**
* **Search by Country Name**
* **Filter by Region**
* **Fetch by Country Code**
* **Add / Remove Favorites**

### 👤 User

* **Sign In / Sign Out**


### 🧪 Testing

* **Unit tests** for `countriesSlice` and `userSlice`
* **Component tests** for `Countries` page using mocked store, routing, and API behavior
* **Coverage** for loading state, success state, and error state

---

## 📁 Project Structure

```
├── src
│   ├── redux
│   │   ├── country
│   │   │   ├── countriesSlice.js
│   │   │   └── countriesSlice.test.js
│   │   └── user
│   │       ├── userSlice.js
│   │       └── userSlice.test.js
│   ├── Components
│   │   └── CountryCard.jsx (mocked in test)
│   ├── Pages
│   │   └── Countries.jsx
│   │   └── test
│   │       └── Countries.test.jsx
```

---

## 🧩 Mocking in Tests

* API calls (`fetchCountries`, etc.) are mocked in slice tests and component tests.
* External packages such as `react-loading-skeleton`, `react-icons`, and `react-router-dom` hooks are mocked.
* Store is created with `configureStore` and injected with reducers for testing.

---

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run test       # Run all tests with experimental VM modules
```

---

## ✅ Run Specific Tests

```bash
# Run individual slice tests
node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose src/redux/user/userSlice.test.js src/redux/country/countriesSlice.test.js

# Run Countries page test
node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose src/Pages/test/Countries.test.jsx
```

---

## 📦 Dependencies

Refer to `package.json` for full list. Highlights:

* **Redux Toolkit** for state management
* **React Testing Library** & **Jest** for testing
* **React Router**, **Flowbite**, **AOS**, **Mapbox GL**, and others for UI and interactivity

---

## 📝 Notes

* Ensure correct mocking of external modules and APIs.
* Test behavior under different states (loading, success, failure).
* Improve UX with proper skeleton loading and error messages.
