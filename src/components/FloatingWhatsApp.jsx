// src/components/FloatingWhatsApp.jsx

const FloatingWhatsApp = () => {
  // Replace the number with Softplug's actual WhatsApp number (just the country code + number, no +)
  const phoneNumber = "2348108121167"; 
  const message = "Hello, I need help with my Tesla order.";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
    >
      {/* Pure SVG - no external icon library needed */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 fill-current">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 110.9L32 480l117.2-30.9c32.4 17.2 68.9 26.2 105.6 26.2h.1c122.4 0 222-99.6 222-222 0-59.3-23.1-115.1-65.1-157.1zM224 416c-33.2 0-65.6-8.9-94.5-25.7l-6.7-4-69.4 18.4 18.5-67.7-4.4-6.9C50.6 298.7 41 266.8 41 234c0-100.9 82-182.9 182.9-182.9 48.9 0 94.8 19 129.4 53.6s53.6 80.5 53.6 129.4c0 100.9-82.9 183-183 183z"/>
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
