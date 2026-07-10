import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, BadgeCheck, CheckCircle2, 
  ArrowRight, ThumbsUp, ThumbsDown, 
  Shield, Zap, Star, Globe, Clock, Car, Wallet, Users, Award
} from 'lucide-react';

// --- Navbar Component ---
const Navbar = ({ branding }) => {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { label: "Giveaway", href: "#giveaway" },
    { label: "Info", href: "#info" },
    { label: "Instruction", href: "#instruction" },
    { label: "Participate", href: "#participate" },
    { label: "Transactions", href: "#transactions" }
  ];
  
  const nameParts = (branding.site_name || "Tesla Motors").split(' ');

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={branding.logo_url || "/images/tesla-logo.png"} alt="Logo" className="w-12 h-10 object-contain" />
          <div className="text-2xl font-black">
            <span className="text-red-600">{nameParts[0]}</span>
            <span className="text-gray-900"> {nameParts.slice(1).join(' ')}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => <a key={l.href} href={l.href} className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors">{l.label}</a>)}
          <Link to="/Participate"><button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-md">Claim Now</button></Link>
        </div>
        <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-4 container mx-auto px-6">
          {links.map(l => <a key={l.href} href={l.href} className="block text-gray-700 hover:text-red-600 font-medium" onClick={() => setIsOpen(false)}>{l.label}</a>)}
          <Link to="/Participate" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md">Claim Now</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

// --- Floating Notification Toast Component ---
const FloatingNotification = () => {
  const [current, setCurrent] = useState(null);
  const [data, setData] = useState([]);
  
  const generateFakeUsers = () => {
    const firstNames = ["James", "Sophie", "Carlos", "Yuki", "Emma", "Lucas", "Fatima", "Pierre", "Amara", "Hans", "Raj", "Maria", "Kevin", "Anna", "David", "Liam", "Jin", "Mei", "Thomas", "Ingrid", "Pablo", "Olga", "Lars", "Sara", "Kwame", "Nadia", "Rafael", "Hana", "Viktor", "Celine"];
    const lastNames = ["O.", "M.", "R.", "T.", "W.", "B.", "A.", "D.", "N.", "M.", "P.", "G.", "O.", "S.", "C.", "M.", "W.", "L.", "B.", "H.", "M.", "P.", "E.", "F.", "D.", "B.", "C.", "K.", "N.", "F."];
    const countries = ["🇺🇸 USA", "🇬🇧 UK", "🇲🇽 Mexico", "🇯🇵 Japan", "🇨🇦 Canada", "🇧🇷 Brazil", "🇦🇪 UAE", "🇫🇷 France", "🇿🇦 South Africa", "🇩🇪 Germany", "🇮🇳 India", "🇦🇷 Argentina", "🇰🇪 Kenya", "🇷🇺 Russia", "🇦🇺 Australia", "🇮🇪 Ireland", "🇰🇷 South Korea", "🇸🇬 Singapore", "🇧🇪 Belgium", "🇳🇴 Norway", "🇨🇴 Colombia", "🇵🇱 Poland", "🇸🇪 Sweden", "🇩🇰 Denmark", "🇬🇭 Ghana", "🇲🇦 Morocco", "🇵🇹 Portugal", "🇨🇿 Czech Republic", "🇺🇦 Ukraine", "🇨🇭 Switzerland"];
    const carModels = ["Tesla Model 3 2024", "Tesla Model Y 2025", "Tesla Model S 2025", "Tesla Model X 2024", "Tesla Cybertruck 2025", "Tesla Roadster 2025", "Tesla Model 3 2025", "Tesla Model Y 2024"];
    const fees = ["$299", "$349", "$399", "$249", "$329", "$289", "$319", "$359"];

    const users = [];
    for (let i = 0; i < 55; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      users.push({
        name: `${firstName} ${lastName}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        car: carModels[Math.floor(Math.random() * carModels.length)],
        fee: fees[Math.floor(Math.random() * fees.length)]
      });
    }
    return users;
  };

  useEffect(() => {
    setData(generateFakeUsers());
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    
    const storedShown = JSON.parse(localStorage.getItem('shown_toasts_names') || '[]');
    const remainingNames = data.filter(item => !storedShown.includes(item.name));
    const activeList = remainingNames.length > 0 ? remainingNames : data;
    
    if (remainingNames.length === 0) localStorage.removeItem('shown_toasts_names');

    let index = 0, showTimeout, nextTimeout;
    const startLoop = () => {
      const user = activeList[index % activeList.length];
      setCurrent(user);
      const currentShown = JSON.parse(localStorage.getItem('shown_toasts_names') || '[]');
      if (!currentShown.includes(user.name)) {
        currentShown.push(user.name);
        localStorage.setItem('shown_toasts_names', JSON.stringify(currentShown));
      }
      index++;
      showTimeout = setTimeout(() => setCurrent(null), 4000);
      const randomDelay = 20000 + Math.random() * 10000;
      nextTimeout = setTimeout(startLoop, randomDelay);
    };
    const initialTimeout = setTimeout(startLoop, 2000);
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(showTimeout);
      clearTimeout(nextTimeout);
    };
  }, [data]);

  return (
    <div className="fixed top-20 sm:top-24 z-50 w-[85%] sm:max-w-xs sm:w-auto pointer-events-none left-1/2 sm:left-6 -translate-x-1/2 sm:translate-x-0">
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 sm:p-4 pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm">{current.name}</span>
                  <span className="text-xs text-gray-500">{current.country}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Just paid delivery fee for <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">{current.car}</span>
                </p>
                <p className="text-green-600 font-bold text-sm mt-1">🚗 Car confirmed & dispatched! ({current.fee} fee paid)</p>
              </div>
            </div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-red-500 rounded-full" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 4, ease: "linear" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helper functions for Car Grid ---
const getCarColor = (index) => {
  const colors = ["from-gray-900 to-gray-800", "from-sky-800 to-sky-900", "from-red-800 to-red-900", "from-emerald-700 to-emerald-900", "from-violet-800 to-violet-900", "from-slate-800 to-slate-900", "from-cyan-700 to-cyan-900", "from-indigo-800 to-indigo-900", "from-zinc-700 to-zinc-900"];
  return colors[index % colors.length];
};
const getCarBadge = (index) => {
  const badges = ["🏆 Most Popular", "⚡ Express", "👑 Premium", "💚 Best Value", "🔥 New", "💎 Ultra", "🌊 City Special", "👨‍👩‍👧 Family Pick", "⭐ Top Rated"];
  return badges[index % badges.length];
};
const getBadgeColor = (index) => {
  const colors = ["bg-yellow-400 text-yellow-900", "bg-blue-500 text-white", "bg-purple-500 text-white", "bg-green-500 text-white", "bg-orange-500 text-white", "bg-yellow-500 text-black", "bg-cyan-400 text-cyan-900", "bg-pink-500 text-white", "bg-amber-400 text-amber-900"];
  return colors[index % colors.length];
};

// --- Home Component ---
export default function Home() {
  const [counter, setCounter] = useState(() => {
    const saved = localStorage.getItem('live_counter');
    return saved ? parseInt(saved, 10) : 12847;
  });
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({
    branding: { site_name: "Tesla Motors", logo_url: "/images/tesla-logo.png", hero_image_url: "/images/tesla-model-s.jpg" },
    cars: []
  });
  
  // Load Settings
  useEffect(() => {
    const raw = localStorage.getItem("tesla_site_settings");
    if (raw) {
      try {
        const data = JSON.parse(raw)[0];
        if (data) {
          const count = parseInt(data.car_count) || 0;
          const loadedCars = Array.from({ length: count }, (_, i) => ({
            name: data[`car_${i+1}_name`] || "",
            tier: data[`car_${i+1}_tier`] || "",
            fee: data[`car_${i+1}_fee`] || "$299",
            delivery: data[`car_${i+1}_delivery`] || "7-10 Business Days",
            img: data[`car_${i+1}_img`] || "/images/tesla-model-3.jpg"
          }));
          setSettings({
            branding: {
              site_name: data.site_name || "Tesla Motors",
              logo_url: data.logo_url || "/images/tesla-logo.png",
              hero_image_url: data.hero_image_url || "/images/tesla-model-s.jpg"
            },
            cars: loadedCars
          });
        }
      } catch (e) { console.error("Failed to load settings", e); }
    }
  }, []);

  // Live Counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(c => {
        const newCount = c + Math.floor(Math.random() * 3);
        localStorage.setItem('live_counter', String(newCount));
        return newCount;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Live Feed Logic (Shows latest 5 only, with random 0-6s delay)
  useEffect(() => {
    const createTransaction = () => {
      const firstNames = ["James", "Sophie", "Carlos", "Yuki", "Emma", "Lucas", "Fatima", "Pierre", "Amara", "Hans", "Raj", "Maria", "Kevin", "Anna", "David", "Liam", "Jin", "Mei", "Thomas", "Ingrid", "Pablo", "Olga", "Lars", "Sara", "Kwame", "Nadia", "Rafael", "Hana", "Viktor", "Celine"];
      const lastNames = ["O.", "M.", "R.", "T.", "W.", "B.", "A.", "D.", "N.", "M.", "P.", "G.", "O.", "S.", "C.", "M.", "W.", "L.", "B.", "H.", "M.", "P.", "E.", "F.", "D.", "B.", "C.", "K.", "N.", "F."];
      const countries = ["🇺🇸 USA", "🇬🇧 UK", "🇲🇽 Mexico", "🇯🇵 Japan", "🇨🇦 Canada", "🇧🇷 Brazil", "🇦🇪 UAE", "🇫🇷 France", "🇿🇦 South Africa", "🇩🇪 Germany", "🇮🇳 India", "🇦🇷 Argentina", "🇰🇪 Kenya", "🇷🇺 Russia", "🇦🇺 Australia", "🇮🇪 Ireland", "🇰🇷 South Korea", "🇸🇬 Singapore", "🇧🇪 Belgium", "🇳🇴 Norway", "🇨🇴 Colombia", "🇵🇱 Poland", "🇸🇪 Sweden", "🇩🇰 Denmark", "🇬🇭 Ghana", "🇲🇦 Morocco", "🇵🇹 Portugal", "🇨🇿 Czech Republic", "🇺🇦 Ukraine", "🇨🇭 Switzerland"];
      const carModels = ["Tesla Model 3 2024", "Tesla Model Y 2025", "Tesla Model S 2025", "Tesla Model X 2024", "Tesla Cybertruck 2025", "Tesla Roadster 2025", "Tesla Model 3 2025", "Tesla Model Y 2024"];
      const fees = ["$299", "$349", "$399", "$249", "$329", "$289", "$319", "$359"];
      const statuses = ["Delivery confirmed ✓", "Car dispatched 🚚", "Payment verified ✓", "Shipment confirmed ✓", "Order processed"];

      return {
        id: Date.now() + Math.random(),
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        car: carModels[Math.floor(Math.random() * carModels.length)],
        fee: fees[Math.floor(Math.random() * fees.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: Date.now()
      };
    };

    const initialBatch = Array.from({ length: 5 }, () => {
      const tx = createTransaction();
      tx.timestamp = tx.timestamp - Math.floor(Math.random() * 15 * 60 * 1000);
      return tx;
    });
    setTransactions(initialBatch);

    let timeoutId;
    const scheduleNext = () => {
      const randomDelay = Math.floor(Math.random() * 6000);
      timeoutId = setTimeout(() => {
        setTransactions(prev => {
          const newTx = createTransaction();
          // Only keeping the latest 5 items as requested
          return [newTx, ...prev].slice(0, 5);
        });
        scheduleNext(); 
      }, randomDelay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  // ---------- RENDER START ----------
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar branding={settings.branding} />
      <FloatingNotification />

      {/* HERO */}
      <section id="giveaway" className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen relative overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                  <BadgeCheck className="w-4 h-4 text-red-600 fill-red-600" />
                  <span className="text-sm font-semibold text-gray-700">Official Event</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 shadow-sm">
                  <span className="relative flex w-2 h-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" /></span>
                  <span className="text-sm font-semibold text-green-700">LIVE — {counter.toLocaleString()} joined</span>
                </motion.div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">Win a <span className="text-red-600">Brand New</span> Electric Car</h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-gray-600 mt-6 text-lg max-w-lg">
                We are giving away brand new electric cars to participants worldwide. Claim your car today!
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/Participate"><button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg shadow-red-200">🚗 Claim Your Free Car →</button></Link>
                <a href="#participate"><button className="border-2 border-gray-300 text-gray-800 hover:bg-gray-50 px-8 py-6 text-lg font-bold rounded-xl">View All Models</button></a>
              </motion.div>
              <div className="flex items-center gap-6 mt-10 text-gray-500 text-sm font-medium"><span>🔒 SSL Secured</span><span>✅ Verified</span><span>🌍 Global</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} className="relative">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 shadow-xl border border-red-100">
                <img src={settings.branding.hero_image_url} alt="Electric Car" className="w-full h-auto rounded-2xl" />
                <div className="mt-4 text-center"><p className="text-red-600 font-black text-2xl">Electric Car</p><p className="text-gray-500 mt-1">100% Free — Just Pay Delivery</p></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AVAILABLE CARS (4) */}
      <section id="info" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Available <span className="text-red-600">Cars</span></h2>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">Choose your preferred electric car. All models are brand new editions delivered straight to your door.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} transition={{ staggerChildren: 0.15 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.cars.slice(0, 4).map((car, idx) => (
              <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className={`bg-gradient-to-br ${getCarColor(idx)} rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center relative`}>
                <div className="absolute top-3 right-3"><span className="text-white text-xs font-bold px-2 py-1 rounded-full bg-red-600">{getCarBadge(idx)}</span></div>
                <img src={car.img} alt={car.name} className="w-full h-32 object-contain rounded-xl mb-4" />
                <h3 className="text-xl font-black text-gray-900">{car.name}</h3>
                <p className="text-red-600 font-bold text-lg mt-1">{car.tier}</p>
                <p className="text-gray-500 text-sm mt-2">{car.delivery}</p>
                <div className="mt-4 bg-white rounded-xl py-2 px-4 border border-gray-200"><span className="text-green-600 font-bold text-sm">FREE 🎉</span></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CEO & OFFICIAL ANNOUNCEMENTS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Straight from the <span className="text-red-600">CEO</span></h2>
            <p className="text-gray-600 mt-4 text-lg">Official announcements from our leadership</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/elon-musk.jpg" alt="CEO" className="w-12 h-12 rounded-full object-cover border-2 border-red-500" />
                <div><div className="flex items-center gap-1"><span className="font-bold text-gray-900">Elon Musk</span><BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" /></div><span className="text-gray-500 text-sm">CEO</span></div>
              </div>
              <p className="text-gray-800 leading-relaxed mb-4">We are committed to accelerating the world's transition to sustainable energy. As part of our mission, we're launching a worldwide giveaway of our electric vehicles — completely free. Just cover the delivery cost and a brand-new car will be shipped directly to your door. 🚗⚡</p>
              <div className="flex items-center gap-4 text-gray-400 text-sm"><span>❤️ 128K</span><span>🔁 47K</span><span>💬 8.2K</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src={settings.branding.logo_url} alt="Official" className="w-12 h-12 rounded-full object-contain border-2 border-red-500 bg-white p-1" />
                <div><div className="flex items-center gap-1"><span className="font-bold text-gray-900">Official Account</span><BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" /></div><span className="text-gray-500 text-sm">@Official</span></div>
              </div>
              <p className="text-gray-800 leading-relaxed mb-4">📢 OFFICIAL ANNOUNCEMENT: Our global car giveaway is NOW LIVE! 🌍 Open to ALL countries. No purchase necessary — just cover the one-time delivery fee. Don't miss out! 🎁🚗</p>
              <div className="flex items-center gap-4 text-gray-400 text-sm"><span>❤️ 215K</span><span>🔁 89K</span><span>💬 14K</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DARK VIDEO 1 (ANNOUNCEMENT) */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-4"><span className="relative flex w-2 h-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full w-2 h-2 bg-red-500" /></span><span className="text-red-400 text-sm font-bold uppercase tracking-wide">Official Announcement</span></div>
            <h2 className="text-4xl font-black text-white">Our <span className="text-red-500">Global Car</span> Giveaway</h2>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">Watch the official announcement of our biggest car giveaway for all countries worldwide.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-sm mx-auto md:max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-gray-800 bg-black"><div className="relative w-full" style={{ paddingBottom: "177.78%" }}><iframe src="https://www.youtube.com/embed/XTeWKmlNmN8?rel=0&modestbranding=1&fs=1&playsinline=1" title="Official Announcement" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" /></div></div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><img src={settings.branding.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-contain bg-white border border-red-600 p-0.5" /><div><p className="text-white text-sm font-bold">Official</p><p className="text-gray-400 text-xs">28.4M subscribers</p></div></div>
              <button className="px-4 py-2 rounded-full text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors">Subscribe</button>
            </div>
            <div className="mt-4"><p className="text-gray-400 text-xs mb-3 font-semibold">Comments · 70,842</p><div className="space-y-3">
              {[{name:"Mike Johnson",avatar:"MJ",color:"bg-blue-600",time:"2 days ago",text:"Just received my car!! I paid the delivery fee and within 9 days the car was at my door. This is REAL! 🚗⚡",likes:48210},{name:"Sarah Williams",avatar:"SW",color:"bg-pink-500",time:"1 day ago",text:"I received my car after paying the delivery fee. I cried when I saw the car parked outside! 🙏",likes:32440},{name:"Carlos Mendez",avatar:"CM",color:"bg-green-600",time:"3 days ago",text:"From Mexico! I received my car after paying the delivery fee. This giveaway is 100% real!",likes:29180}].map((c,i)=>(
                <div key={i} className="flex gap-3"><div className={`w-8 h-8 ${c.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{c.avatar}</div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="text-white text-xs font-bold">{c.name}</span><span className="text-gray-500 text-xs">{c.time}</span></div><p className="text-gray-300 text-xs leading-relaxed">{c.text}</p><div className="flex items-center gap-4 mt-1.5"><button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs"><ThumbsUp className="w-3 h-3" /> {c.likes.toLocaleString()}</button><button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs"><ThumbsDown className="w-3 h-3" /></button></div></div></div>
              ))}
            </div><button className="flex items-center gap-1 text-red-400 text-xs font-semibold mt-3 hover:text-red-300">View 70,842 more comments</button></div>
          </motion.div>
        </div>
      </section>

      {/* DARK VIDEO 2 (MORE PROOF) */}
      <section className="py-20 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h2 className="text-4xl font-black text-white">More <span className="text-red-500">Proof</span> from Winners</h2>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">Watch real testimonials from car recipients around the world.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-sm mx-auto md:max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-gray-800 bg-black"><div className="relative w-full" style={{ paddingBottom: "177.78%" }}><iframe src="https://www.youtube.com/embed/XDkzm_LR0Co?rel=0&modestbranding=1&fs=1&playsinline=1" title="Winners Testimonials" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" /></div></div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><img src={settings.branding.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-contain bg-white border border-red-600 p-0.5" /><div><p className="text-white text-sm font-bold">Official</p><p className="text-gray-400 text-xs">12.8M subscribers</p></div></div>
              <button className="px-4 py-2 rounded-full text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors">Subscribe</button>
            </div>
            <div className="mt-4"><p className="text-gray-400 text-xs mb-3 font-semibold">Comments · 75,600</p><div className="space-y-3">
              {[{name:"Mike Johnson",avatar:"MJ",color:"bg-blue-600",country:"🇺🇸 USA",text:"I received my car!! I paid the delivery fee and within a week my brand new car arrived at my door. 🚗⚡",likes:4821},{name:"Sarah Williams",avatar:"SW",color:"bg-pink-500",country:"🇺🇸 USA",text:"Just received my car after paying for the delivery fee. I cried when I saw the car parked outside! 🙏",likes:3244},{name:"Carlos Mendez",avatar:"CM",color:"bg-green-600",country:"🇲🇽 Mexico",text:"From Mexico! I received my car after paying the delivery fee. This giveaway is 100% real.",likes:2918}].map((c,i)=>(
                <div key={i} className="flex gap-3"><div className={`w-8 h-8 ${c.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{c.avatar}</div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="text-white text-xs font-bold">{c.name}</span><span className="text-gray-500 text-xs">{c.country}</span></div><p className="text-gray-300 text-xs leading-relaxed">{c.text}</p><button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs mt-1.5"><ThumbsUp className="w-3 h-3" /> {c.likes.toLocaleString()}</button></div></div>
              ))}
            </div><button className="flex items-center gap-1 text-red-400 text-xs font-semibold mt-3 hover:text-red-300">View 75,600 more comments</button></div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">What <span className="text-red-600">Winners</span> Are Saying</h2>
            <p className="text-gray-600 mt-4 text-lg">Real testimonials from verified car recipients</p>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">MJ</div>
                <div><p className="font-bold text-gray-900">Michael R.</p><p className="text-gray-500 text-sm">🇺🇸 USA</p></div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">"I received my car! I paid the delivery fee and the car arrived at my door in 9 days. I can't believe how real this is!"</p>
              <div className="bg-green-50 rounded-xl px-4 py-2 inline-block"><span className="text-green-700 font-bold text-sm">✅ Received: Tesla Model 3 2024 🚗</span></div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {[0,1,2,3,4,5,6,7].map(i => <button key={i} className={`w-3 h-3 rounded-full ${i===0 ? "bg-red-600" : "bg-gray-300"}`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* FOLLOW SOCIAL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Follow Us <span className="text-red-600">Official</span></h2>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">Verified official social media accounts.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Official", handle: "@official", platform: "X", url: "https://twitter.com", avatar: settings.branding.logo_url, verified: true, bg: "bg-black", desc: "Official X account.", followers: "28.4M followers" },
              { name: "Official", handle: "Official", platform: "Facebook", url: "https://facebook.com", avatar: settings.branding.logo_url, verified: true, bg: "bg-blue-600", desc: "Official Facebook page.", followers: "14.2M likes" },
              { name: "Official", handle: "@official", platform: "Instagram", url: "https://instagram.com", avatar: settings.branding.logo_url, verified: true, bg: "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400", desc: "Official Instagram.", followers: "12.8M followers" }
            ].map((item, idx) => (
              <motion.a key={idx} href={item.url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-4">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-contain border-2 border-red-200 bg-white p-1" />
                  <div>
                    <div className="flex items-center gap-1"><span className="font-bold text-gray-900 text-sm">{item.name}</span>{item.verified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />}</div>
                    <span className="text-gray-500 text-xs">{item.handle}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{item.followers}</span>
                  <div className={`${item.bg} rounded-full p-2 group-hover:scale-110 transition-transform`}>{/* Icon placeholder */}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTIONS */}
      <section id="instruction" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">How to Claim Your <span className="text-red-600">Car</span></h2>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">Follow these simple steps to receive your brand new electric car giveaway.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Register Your Details", desc: "Enter your name, delivery address, and contact information so we can ship your car directly to you." },
              { step: "02", title: "Choose Your Car", desc: "Select your preferred electric model — all brand new!" },
              { step: "03", title: "Pay Delivery Fee", desc: "Pay the small one-time delivery fee to cover shipping and logistics. This is the only fee required." },
              { step: "04", title: "Receive Your Car", desc: "Your brand new electric car will be delivered to your door within 7–14 business days. Enjoy!" }
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 }} className="relative">
                {idx < 3 && <div className="hidden lg:block absolute top-10 left-full w-full z-10"><ArrowRight className="w-6 h-6 text-red-300 -ml-3" /></div>}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4"><span className="text-white font-black text-lg">{item.step}</span></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }} className="text-center mt-10">
            <Link to="/Participate"><button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold rounded-xl">🚗 Start Claiming Your Car Now →</button></Link>
          </motion.div>
        </div>
      </section>

      {/* FULL CAR GRID (PARTICIPATE) */}
      <section id="participate" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-200 rounded-full px-4 py-1.5 mb-4">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-sm font-bold uppercase tracking-wide">Official Global Giveaway</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">Choose Your <span className="text-red-600">Electric Car</span></h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">We are gifting brand new electric vehicles to participants worldwide.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {settings.cars.map((car, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className={`bg-gradient-to-br ${getCarColor(idx)} p-5 relative`}>
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getBadgeColor(idx)}`}>{getCarBadge(idx)}</span>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{car.tier}</p>
                  <h3 className="text-white text-xl font-black mt-1">{car.name}</h3>
                  <p className="text-white/60 text-sm">2025 Model</p>
                  <img src={car.img} alt={car.name} className="w-full h-40 object-contain rounded-xl mt-3" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-red-500 shrink-0" /><div><p className="text-xs text-gray-400">Power</p><p className="text-xs font-bold text-gray-800">510 hp</p></div></div>
                    <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2"><Star className="w-3.5 h-3.5 text-red-500 shrink-0" /><div><p className="text-xs text-gray-400">Range</p><p className="text-xs font-bold text-gray-800">358 mi</p></div></div>
                    <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-red-500 shrink-0" /><div><p className="text-xs text-gray-400">Ships To</p><p className="text-xs font-bold text-gray-800">All Countries</p></div></div>
                    <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-red-500 shrink-0" /><div><p className="text-xs text-gray-400">Delivery</p><p className="text-xs font-bold text-gray-800">{car.delivery}</p></div></div>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">One-Time Delivery Fee</p>
                    <p className="text-3xl font-black text-red-600">{car.fee}</p>
                    <p className="text-xs text-gray-400 mt-1">Covers shipping, customs & logistics</p>
                  </div>
                  <div className="mt-auto">
                    <Link to={`/Participate?wallet=${idx}`}>
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                        <span>🚗 Claim This Car Now →</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 text-center shadow-xl">
            <p className="font-black text-xl mb-2">⚡ Electric — Built for the Future</p>
            <p className="text-red-100 text-base max-w-3xl mx-auto leading-relaxed">
              We are the world's leading electric vehicle manufacturer. Each participant is eligible for <strong>one vehicle only</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====== LIVE TRANSACTIONS (THE FIXED SECTION) ====== */}
      <section id="transactions" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Live <span className="text-red-600">Deliveries</span></h2>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">Real-time updates of car deliveries happening right now across the world.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between text-sm font-semibold">
              <span>Live Delivery Feed</span>
              <span className="flex items-center gap-2">
                <span className="relative flex w-2 h-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" /></span>
                LIVE
              </span>
            </div>
            {/* Removed max-h-[500px] and overflow-y-auto to make it non-scrollable */}
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="px-6 py-4 flex items-center justify-between animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-gray-900 font-bold text-sm">
                        {tx.name} <span className="text-gray-400 font-normal">{tx.country}</span>
                      </p>
                      <p className="text-gray-500 text-xs">{tx.car} · {tx.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-sm">{tx.fee}</p>
                    <p className="text-gray-400 text-xs">{getTimeAgo(tx.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-2xl font-black"><span className="text-red-600">{settings.branding.site_name.split(' ')[0]}</span><span className="text-white"> {settings.branding.site_name.split(' ').slice(1).join(' ')}</span></div>
            <div className="flex flex-wrap gap-6 text-sm">
              {["Giveaway", "Info", "Instruction", "Participate", "Transactions"].map(e => <a key={e} href={`#${e.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">{e}</a>)}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["🔒 SSL Secured", "🚗 Certified", "⚡ Electric Vehicle", "✅ 10,000+ Delivered", "🌐 Official Event"].map((e, i) => <span key={i} className="text-gray-500 text-xs font-semibold border border-gray-800 rounded-full px-3 py-1">{e}</span>)}
          </div>
          <div className="border-t border-gray-800 mt-4 pt-8 text-center">
            <p className="text-gray-500 text-sm max-w-3xl mx-auto">This is an official global car giveaway event. We are gifting brand new electric vehicles to participants worldwide.</p>
            <p className="text-gray-600 text-sm mt-4">© 2025 Official Giveaway. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
