import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, BadgeCheck, CheckCircle2, 
  ArrowRight, ThumbsUp, ThumbsDown, Share2, Download, 
  MessageCircle, Eye, Heart, Play, User, MapPin, Globe, 
  Clock, Zap, Star, Car, Wallet, CheckCircle, Shield, 
  Lock, Users, Award, Sparkles
} from 'lucide-react';

// --- Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { label: "Giveaway", href: "#giveaway" },
    { label: "Info", href: "#info" },
    { label: "Instruction", href: "#instruction" },
    { label: "Participate", href: "#participate" },
    { label: "Transactions", href: "#transactions" }
  ];
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/tesla-logo.png" alt="Tesla Logo" className="w-12 h-10 object-contain" />
          <div className="text-2xl font-black">
            <span className="text-red-600">Tesla</span>
            <span className="text-gray-900"> Motors</span>
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

  useEffect(() => {
    // Initial mock data list
    setData([
      { name: "James O.", country: "🇺🇸 USA", car: "Tesla Model 3 2024", fee: "$299" },
      { name: "Sophie M.", country: "🇬🇧 UK", car: "Tesla Model Y 2025", fee: "$349" },
      { name: "Carlos R.", country: "🇲🇽 Mexico", car: "Tesla Model 3 2024", fee: "$249" },
      { name: "Yuki T.", country: "🇯🇵 Japan", car: "Tesla Model S 2025", fee: "$399" },
      { name: "Emma W.", country: "🇨🇦 Canada", car: "Tesla Model 3 2025", fee: "$329" },
      { name: "Lucas B.", country: "🇧🇷 Brazil", car: "Tesla Model Y 2024", fee: "$289" },
      { name: "Fatima A.", country: "🇦🇪 UAE", car: "Tesla Model S 2024", fee: "$399" },
      { name: "Pierre D.", country: "🇫🇷 France", car: "Tesla Model 3 2025", fee: "$249" },
      { name: "Amara N.", country: "🇿🇦 South Africa", car: "Tesla Model Y 2025", fee: "$319" },
      { name: "Hans M.", country: "🇩🇪 Germany", car: "Tesla Model 3 2024", fee: "$299" },
      { name: "Raj P.", country: "🇮🇳 India", car: "Tesla Model Y 2025", fee: "$349" },
      { name: "Maria G.", country: "🇦🇷 Argentina", car: "Tesla Model 3 2024", fee: "$249" },
      { name: "Kevin O.", country: "🇰🇪 Kenya", car: "Tesla Model 3 2025", fee: "$329" },
      { name: "Anna S.", country: "🇷🇺 Russia", car: "Tesla Model S 2025", fee: "$399" },
      { name: "David C.", country: "🇦🇺 Australia", car: "Tesla Cybertruck 2025", fee: "$319" }
    ]);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    let index = 0;
    let showTimeout, nextTimeout;
    const startLoop = () => {
      setCurrent(data[index % data.length]);
      index++;
      showTimeout = setTimeout(() => setCurrent(null), 4000);
      nextTimeout = setTimeout(startLoop, 6000 + Math.random() * 4000);
    };
    const initialTimeout = setTimeout(startLoop, 2000);
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(showTimeout);
      clearTimeout(nextTimeout);
    };
  }, [data]);

  return (
    <div className="fixed top-24 left-6 z-50 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 pointer-events-auto"
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

// --- Home Component ---
export default function Home() {
  const [counter, setCounter] = useState(12847);
  
  useEffect(() => {
    const interval = setInterval(() => setCounter(c => c + Math.floor(Math.random() * 3)), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <FloatingNotification />

      {/* ====== HERO SECTION ====== */}
      <section id="giveaway" className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen relative overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                  <BadgeCheck className="w-4 h-4 text-red-600 fill-red-600" />
                  <span className="text-sm font-semibold text-gray-700">Official Event</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 shadow-sm">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" />
                  </span>
                  <span className="text-sm font-semibold text-green-700">LIVE — {counter.toLocaleString()} joined</span>
                </motion.div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Win a <span className="text-red-600">Brand New</span> Tesla Electric Car
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-gray-600 mt-6 text-lg max-w-lg">
                Tesla, the world's leading electric vehicle manufacturer, is giving away brand new electric cars to participants worldwide. Claim your car today!
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/Participate">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg shadow-red-200">🚗 Claim Your Free Car →</button>
                </Link>
                <a href="#participate">
                  <button className="border-2 border-gray-300 text-gray-800 hover:bg-gray-50 px-8 py-6 text-lg font-bold rounded-xl">View All Models</button>
                </a>
              </motion.div>
              <div className="flex items-center gap-6 mt-10 text-gray-500 text-sm font-medium">
                <span>🔒 SSL Secured</span>
                <span>✅ Verified</span>
                <span>🌍 Global</span>
              </div>
            </motion.div>
            {/* Right */}
            <motion.div initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} className="relative">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 shadow-xl border border-red-100">
                <img src="/images/tesla-model-s.jpg" alt="Tesla Electric Car" className="w-full h-auto rounded-2xl" />
                <div className="mt-4 text-center">
                  <p className="text-red-600 font-black text-2xl">Tesla Electric Car</p>
                  <p className="text-gray-500 mt-1">100% Free — Just Pay Delivery</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== AVAILABLE CARS (INFO) ====== */}
      <section id="info" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Available <span className="text-red-600">Tesla Cars</span></h2>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Choose your preferred Tesla electric car. All models are brand new <strong className="text-red-600">2024–2025</strong> editions delivered straight to your door.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} transition={{ staggerChildren: 0.15 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Tesla Model 3 2025", amount: "Electric Sedan", sub: "358mi range · 510hp", color: "from-red-50 to-red-100", badge: "Most Popular", img: "/images/tesla-model-3.jpg" },
              { label: "Tesla Model Y 2025", amount: "Electric SUV", sub: "330mi range · 384hp", color: "from-blue-50 to-blue-100", badge: "Best SUV", img: "/images/tesla-model-y.jpg" },
              { label: "Tesla Model S 2025", amount: "Luxury Sedan", sub: "405mi range · 670hp", color: "from-gray-50 to-gray-100", badge: "Premium", img: "/images/tesla-model-s.jpg" },
              { label: "Tesla Model X 2025", amount: "Luxury SUV", sub: "348mi range · 670hp", color: "from-green-50 to-green-100", badge: "Eco Pick", img: "/images/tesla-model-x.jpg" }
            ].map((car, idx) => (
              <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className={`bg-gradient-to-br ${car.color} rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center relative`}>
                <div className="absolute top-3 right-3"><span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{car.badge}</span></div>
                <img src={car.img} alt={car.label} className="w-full h-32 object-contain rounded-xl mb-4" />
                <h3 className="text-xl font-black text-gray-900">{car.label}</h3>
                <p className="text-red-600 font-bold text-lg mt-1">{car.amount}</p>
                <p className="text-gray-500 text-sm mt-2">{car.sub}</p>
                <div className="mt-4 bg-white rounded-xl py-2 px-4 border border-gray-200"><span className="text-green-600 font-bold text-sm">FREE 🎉</span></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== CEO & OFFICIAL ANNOUNCEMENTS ====== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Straight from the <span className="text-red-600">CEO</span></h2>
            <p className="text-gray-600 mt-4 text-lg">Official announcements from Tesla's leadership</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Tweet 1 */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/elon-musk.jpg" alt="Elon Musk" className="w-12 h-12 rounded-full object-cover border-2 border-red-500" />
                <div>
                  <div className="flex items-center gap-1"><span className="font-bold text-gray-900">Elon Musk</span><BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" /></div>
                  <span className="text-gray-500 text-sm">CEO, Tesla, Inc.</span>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed mb-4">
                Tesla is committed to accelerating the world's transition to sustainable energy. As part of our mission, we're launching a worldwide giveaway of our electric vehicles — completely free. Just cover the delivery cost and a brand-new Tesla will be shipped directly to your door. 🚗⚡
              </p>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span>❤️ 128K</span><span>🔁 47K</span><span>💬 8.2K</span>
              </div>
            </motion.div>
            {/* Tweet 2 */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/tesla-logo.png" alt="Tesla Official" className="w-12 h-12 rounded-full object-contain border-2 border-red-500 bg-white p-1" />
                <div>
                  <div className="flex items-center gap-1"><span className="font-bold text-gray-900">Tesla Official</span><BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" /></div>
                  <span className="text-gray-500 text-sm">@Tesla · Official Account</span>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed mb-4">
                📢 OFFICIAL ANNOUNCEMENT: Our global Tesla car giveaway is NOW LIVE! 🌍 Open to ALL countries. No purchase necessary — just cover the one-time delivery fee. Model 3, Model Y, Model S, Model X and more available. Don't miss out! 🎁🚗
              </p>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span>❤️ 215K</span><span>🔁 89K</span><span>💬 14K</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== DARK VIDEO SECTION (TESLA ANNOUNCEMENT) ====== */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-4">
              <span className="relative flex w-2 h-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full w-2 h-2 bg-red-500" /></span>
              <span className="text-red-400 text-sm font-bold uppercase tracking-wide">Official Announcement</span>
            </div>
            <h2 className="text-4xl font-black text-white">Tesla's <span className="text-red-500">Global Car</span> Giveaway</h2>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">Watch Tesla's official announcement of their biggest car giveaway for all countries worldwide.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-sm mx-auto md:max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-gray-800 bg-black">
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe src="https://www.youtube.com/embed/XTeWKmlNmN8?rel=0&modestbranding=1&fs=1&playsinline=1" title="Tesla Official Announcement" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/tesla-logo.png" alt="Tesla" className="w-10 h-10 rounded-full object-contain bg-white border border-red-600 p-0.5" />
                <div><p className="text-white text-sm font-bold">Tesla Official</p><p className="text-gray-400 text-xs">28.4M subscribers</p></div>
              </div>
              <button className="px-4 py-2 rounded-full text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors">Subscribe</button>
            </div>
            {/* Comments Section */}
            <div className="mt-4">
              <p className="text-gray-400 text-xs mb-3 font-semibold">Comments · 70,842</p>
              <div className="space-y-3">
                {[
                  { name: "Mike Johnson", avatar: "MJ", color: "bg-blue-600", time: "2 days ago", text: "Just received my Tesla Model 3 2024!! I paid the delivery fee and within 9 days the car was at my door. This is REAL! 🚗⚡", likes: 48210 },
                  { name: "Sarah Williams", avatar: "SW", color: "bg-pink-500", time: "1 day ago", text: "I received my Tesla Model Y 2025 after paying the delivery fee. I cried when I saw the car parked outside! 🙏", likes: 32440 },
                  { name: "Carlos Mendez", avatar: "CM", color: "bg-green-600", time: "3 days ago", text: "From Mexico! I received my Tesla Model 3 2024 after paying the delivery fee. This giveaway is 100% real!", likes: 29180 }
                ].map((c, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`w-8 h-8 ${c.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{c.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><span className="text-white text-xs font-bold">{c.name}</span><span className="text-gray-500 text-xs">{c.time}</span></div>
                      <p className="text-gray-300 text-xs leading-relaxed">{c.text}</p>
                      <div className="flex items-center gap-4 mt-1.5"><button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs"><ThumbsUp className="w-3 h-3" /> {c.likes.toLocaleString()}</button><button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs"><ThumbsDown className="w-3 h-3" /></button></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1 text-red-400 text-xs font-semibold mt-3 hover:text-red-300">View 70,842 more comments</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== MORE PROOF (2ND VIDEO) ====== */}
      <section className="py-20 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h2 className="text-4xl font-black text-white">More <span className="text-red-500">Proof</span> from Winners</h2>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">Watch real testimonials from Tesla car recipients around the world.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-sm mx-auto md:max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-gray-800 bg-black">
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe src="https://www.youtube.com/embed/XDkzm_LR0Co?rel=0&modestbranding=1&fs=1&playsinline=1" title="Tesla Winners Testimonials" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/tesla-logo.png" alt="Tesla" className="w-10 h-10 rounded-full object-contain bg-white border border-red-600 p-0.5" />
                <div><p className="text-white text-sm font-bold">Tesla Global</p><p className="text-gray-400 text-xs">12.8M subscribers</p></div>
              </div>
              <button className="px-4 py-2 rounded-full text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors">Subscribe</button>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-xs mb-3 font-semibold">Comments · 75,600</p>
              <div className="space-y-3">
                {[
                  { name: "Mike Johnson", avatar: "MJ", color: "bg-blue-600", country: "🇺🇸 USA", text: "I received my Tesla car!! I paid the delivery fee and within a week my brand new Tesla Model 3 arrived at my door. 🚗⚡", likes: 4821 },
                  { name: "Sarah Williams", avatar: "SW", color: "bg-pink-500", country: "🇺🇸 USA", text: "Just received my Tesla car after paying for the delivery fee. I cried when I saw the car parked outside! 🙏", likes: 3244 },
                  { name: "Carlos Mendez", avatar: "CM", color: "bg-green-600", country: "🇲🇽 Mexico", text: "From Mexico! I received my Tesla car after paying the delivery fee. This giveaway is 100% real.", likes: 2918 }
                ].map((c, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`w-8 h-8 ${c.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{c.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><span className="text-white text-xs font-bold">{c.name}</span><span className="text-gray-500 text-xs">{c.country}</span></div>
                      <p className="text-gray-300 text-xs leading-relaxed">{c.text}</p>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs mt-1.5"><ThumbsUp className="w-3 h-3" /> {c.likes.toLocaleString()}</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1 text-red-400 text-xs font-semibold mt-3 hover:text-red-300">View 75,600 more comments</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== WINNER TESTIMONIALS ====== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">What <span className="text-red-600">Winners</span> Are Saying</h2>
            <p className="text-gray-600 mt-4 text-lg">Real testimonials from verified Tesla car recipients</p>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">MJ</div>
                <div><p className="font-bold text-gray-900">Michael R.</p><p className="text-gray-500 text-sm">🇺🇸 USA</p></div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">"I received my Tesla Model 3 2024! I paid the delivery fee and the car arrived at my door in 9 days. I can't believe how real this is!"</p>
              <div className="bg-green-50 rounded-xl px-4 py-2 inline-block"><span className="text-green-700 font-bold text-sm">✅ Received: Tesla Model 3 2024 🚗</span></div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {[0,1,2,3,4,5,6,7].map(i => <button key={i} className={`w-3 h-3 rounded-full ${i===0 ? "bg-red-600" : "bg-gray-300"}`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOLLOW TESLA (SOCIAL MEDIA) ====== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Follow <span className="text-red-600">Tesla</span> Official</h2>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">Verified official social media accounts of Tesla worldwide.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Tesla Official", handle: "@Tesla", platform: "X", url: "https://twitter.com/Tesla", avatar: "/images/tesla-logo.png", verified: true, bg: "bg-black", desc: "Official Tesla X account.", followers: "28.4M followers" },
              { name: "Tesla", handle: "Tesla", platform: "Facebook", url: "https://www.facebook.com/Tesla", avatar: "/images/tesla-logo.png", verified: true, bg: "bg-blue-600", desc: "Official Tesla Facebook page.", followers: "14.2M likes" },
              { name: "Tesla", handle: "@teslamotors", platform: "Instagram", url: "https://www.instagram.com/teslamotors/", avatar: "/images/tesla-logo.png", verified: true, bg: "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400", desc: "Official Tesla Instagram.", followers: "12.8M followers" }
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
                  <div className={`${item.bg} rounded-full p-2 group-hover:scale-110 transition-transform`}>{/* Icon Placeholder */}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INSTRUCTIONS ====== */}
      <section id="instruction" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">How to Claim Your <span className="text-red-600">Tesla Car</span></h2>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">Follow these simple steps to receive your brand new Tesla electric car giveaway</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Register Your Details", desc: "Enter your name, delivery address, and contact information so Tesla can ship your car directly to you." },
              { step: "02", title: "Choose Your Tesla Car", desc: "Select your preferred Tesla model: Model 3, Model Y, Model S, or Model X — all brand new!" },
              { step: "03", title: "Pay Delivery Fee", desc: "Pay the small one-time delivery fee to cover shipping and logistics. This is the only fee required." },
              { step: "04", title: "Receive Your Tesla Car", desc: "Your brand new Tesla electric car will be delivered to your door within 7–14 business days. Enjoy!" }
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
            <Link to="/Participate"><button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold rounded-xl">🚗 Start Claiming Your Tesla Now →</button></Link>
          </motion.div>
        </div>
      </section>

      {/* ====== FULL CAR GRID (PARTICIPATE) ====== */}
      <section id="participate" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-200 rounded-full px-4 py-1.5 mb-4">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-sm font-bold uppercase tracking-wide">Official Tesla Global Giveaway</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">Choose Your <span className="text-red-600">Tesla Electric Car</span></h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">Tesla is gifting brand new electric vehicles to participants worldwide.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { name: "Tesla Model 3", tier: "Performance Sedan", year: "2025", fee: "$299", delivery: "7–10 Days", range: "358 mi", power: "510 hp", color: "from-gray-900 to-gray-800", badge: "🏆 Most Popular", badgeColor: "bg-yellow-400 text-yellow-900", img: "/images/tesla-model-3.jpg" },
              { name: "Tesla Model Y", tier: "Premium SUV", year: "2025", fee: "$349", delivery: "5–7 Days", range: "330 mi", power: "384 hp", color: "from-sky-800 to-sky-900", badge: "⚡ Express", badgeColor: "bg-blue-500 text-white", img: "/images/tesla-model-y.jpg" },
              { name: "Tesla Model S", tier: "Luxury Flagship", year: "2025", fee: "$399", delivery: "3–5 Days", range: "405 mi", power: "670 hp", color: "from-red-800 to-red-900", badge: "👑 Premium", badgeColor: "bg-purple-500 text-white", img: "/images/tesla-model-s.jpg" },
              { name: "Tesla Model X", tier: "Luxury SUV", year: "2025", fee: "$249", delivery: "10–14 Days", range: "348 mi", power: "670 hp", color: "from-emerald-700 to-emerald-900", badge: "💚 Best Value", badgeColor: "bg-green-500 text-white", img: "/images/tesla-model-x.jpg" },
              { name: "Tesla Cybertruck", tier: "Electric Truck", year: "2025", fee: "$379", delivery: "5–8 Days", range: "340 mi", power: "845 hp", color: "from-violet-800 to-violet-900", badge: "🔥 New", badgeColor: "bg-orange-500 text-white", img: "/images/tesla-cybertruck.jpg" },
              { name: "Tesla Roadster", tier: "Ultra Performance", year: "2025", fee: "$499", delivery: "3–5 Days", range: "620 mi", power: "1000+ hp", color: "from-slate-800 to-slate-900", badge: "💎 Ultra", badgeColor: "bg-yellow-500 text-black", img: "/images/tesla-roadster.jpg" }
            ].map((car, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className={`bg-gradient-to-br ${car.color} p-5 relative`}>
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${car.badgeColor}`}>{car.badge}</span>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{car.tier}</p>
                  <h3 className="text-white text-xl font-black mt-1">{car.name}</h3>
                  <p className="text-white/60 text-sm">{car.year} Model</p>
                  <img src={car.img} alt={car.name} className="w-full h-40 object-contain rounded-xl mt-3" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-red-500 shrink-0" /><div><p className="text-xs text-gray-400">Power</p><p className="text-xs font-bold text-gray-800">{car.power}</p></div></div>
                    <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2"><Star className="w-3.5 h-3.5 text-red-500 shrink-0" /><div><p className="text-xs text-gray-400">Range</p><p className="text-xs font-bold text-gray-800">{car.range}</p></div></div>
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
                        <span>🚗 Claim This Tesla Now →</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 text-center shadow-xl">
            <p className="font-black text-xl mb-2">⚡ Tesla Electric — Built for the Future</p>
            <p className="text-red-100 text-base max-w-3xl mx-auto leading-relaxed">
              Tesla is the world's <strong>leading electric vehicle manufacturer</strong>. Each participant is eligible for <strong>one vehicle only</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====== LIVE TRANSACTIONS ====== */}
      <section id="transactions" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900">Live <span className="text-red-600">Deliveries</span></h2>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">Real-time updates of Tesla car deliveries happening right now across the world.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between text-sm font-semibold">
              <span>Live Delivery Feed</span>
              <span className="flex items-center gap-2">
                <span className="relative flex w-2 h-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" /></span>
                LIVE
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: "James O.", country: "🇺🇸 USA", car: "Tesla Model 3 2024", status: "Delivery confirmed ✓", fee: "$299", time: "2 min ago" },
                { name: "Sophie M.", country: "🇬🇧 UK", car: "Tesla Model Y 2025", status: "Car dispatched 🚚", fee: "$349", time: "5 min ago" },
                { name: "Carlos R.", country: "🇲🇽 Mexico", car: "Tesla Model 3 2024", status: "Payment verified ✓", fee: "$249", time: "12 min ago" }
              ].map((tx, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div><p className="text-gray-900 font-bold text-sm">{tx.name} <span className="text-gray-400 font-normal">{tx.country}</span></p><p className="text-gray-500 text-xs">{tx.car} · {tx.status}</p></div>
                  </div>
                  <div className="text-right"><p className="text-red-600 font-bold text-sm">{tx.fee}</p><p className="text-gray-400 text-xs">{tx.time}</p></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-2xl font-black"><span className="text-red-600">Tesla</span><span className="text-white"> Motors</span></div>
            <div className="flex flex-wrap gap-6 text-sm">
              {["Giveaway", "Info", "Instruction", "Participate", "Transactions"].map(e => <a key={e} href={`#${e.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">{e}</a>)}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["🔒 SSL Secured", "🚗 Tesla Certified", "⚡ Electric Vehicle", "✅ 10,000+ Delivered", "🌐 Official Event"].map((e, i) => <span key={i} className="text-gray-500 text-xs font-semibold border border-gray-800 rounded-full px-3 py-1">{e}</span>)}
          </div>
          <div className="border-t border-gray-800 mt-4 pt-8 text-center">
            <p className="text-gray-500 text-sm max-w-3xl mx-auto">This is an official Tesla Motors global car giveaway event. Tesla is the world's leading electric vehicle manufacturer gifting brand new electric vehicles to participants worldwide.</p>
            <p className="text-gray-600 text-sm mt-4">© 2025 Tesla Motors Official Giveaway. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
