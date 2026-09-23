// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Moon, Sun, Download, History, AlertTriangle, Wifi, Type, Link as LinkIcon, Mail, Phone, Settings2, Palette } from 'lucide-react';
import { getContrastWarning } from './utils/qrHelpers';
import QRInputs from './components/QRInputs';

export default function App() {
  // --- STATE DECLARATIONS ---
  const [darkMode, setDarkMode] = useState(false);
  const [qrType, setQrType] = useState('url');
  const [qrData, setQrData] = useState({
    url: '', text: '', email: '', subject: '', body: '', 
    phone: '', ssid: '', password: '', encryption: 'WPA', hidden: false
  });
  
  const [qrConfig, setQrConfig] = useState({
    size: 256,
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'Q', // Error correction: L (Low), M (Medium), Q (Quartile), H (High)
    margin: 4,
    includeMargin: true
  });
  
  const [errors, setErrors] = useState({});
  const [contrastWarning, setContrastWarning] = useState(null);
  const [recentQRs, setRecentQRs] = useState([]);
  const [payload, setPayload] = useState('');
  
  const qrRef = useRef(null);

  // --- EFFECTS ---
  // Load Theme and Recent QRs on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    setDarkMode(savedTheme);
    if (savedTheme) document.documentElement.classList.add('dark');
    
    const savedRecents = JSON.parse(localStorage.getItem('recentQRs') || '[]');
    setRecentQRs(savedRecents);
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  // Validation & Payload Generation
  useEffect(() => {
    let newErrors = {};
    let newPayload = '';

    if (qrType === 'url') {
      if (qrData.url && !/^https?:\/\/.+\..+/.test(qrData.url)) {
        newErrors.url = 'Please enter a valid URL (including http/https)';
      }
      newPayload = qrData.url;
    } else if (qrType === 'text') {
      if (qrData.text === '') newErrors.text = 'Text cannot be empty (if entering text)';
      newPayload = qrData.text;
    } else if (qrType === 'email') {
      if (qrData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qrData.email)) {
        newErrors.email = 'Invalid email address';
      }
      newPayload = `mailto:${qrData.email}?subject=${encodeURIComponent(qrData.subject)}&body=${encodeURIComponent(qrData.body)}`;
    } else if (qrType === 'phone') {
      if (qrData.phone && !/^\+?[0-9\s\-()]+$/.test(qrData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
      newPayload = `tel:${qrData.phone}`;
    } else if (qrType === 'wifi') {
      if (qrData.ssid === '') newErrors.ssid = 'Network name (SSID) is required';
      newPayload = `WIFI:T:${qrData.encryption};S:${qrData.ssid};P:${qrData.password};H:${qrData.hidden ? 'true' : 'false'};;`;
    }

    setErrors(newErrors);
    setPayload(newPayload);
  }, [qrType, qrData]);

  // Contrast Checking
  useEffect(() => {
    setContrastWarning(getContrastWarning(qrConfig.fgColor, qrConfig.bgColor));
  }, [qrConfig.fgColor, qrConfig.bgColor]);


  // --- HANDLERS ---
  const handleDataChange = (field, value) => {
    setQrData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (field, value) => {
    setQrConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = () => {
    if (!payload || Object.keys(errors).length > 0) return;
    
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${qrType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    saveToRecent();
  };

  const saveToRecent = () => {
    const newRecent = {
      id: Date.now(),
      type: qrType,
      data: qrData,
      config: qrConfig,
      date: new Date().toLocaleDateString()
    };
    const updatedRecents = [newRecent, ...recentQRs].slice(0, 5); // Keep last 5
    setRecentQRs(updatedRecents);
    localStorage.setItem('recentQRs', JSON.stringify(updatedRecents));
  };

  const loadRecent = (recent) => {
    setQrType(recent.type);
    setQrData(recent.data);
    setQrConfig(recent.config);
  };

  // Navigation Tabs Array
  const tabs = [
    { id: 'url', icon: LinkIcon, label: 'URL' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'phone', icon: Phone, label: 'Phone' },
    { id: 'wifi', icon: Wifi, label: 'WiFi' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">MAQER</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">THE QR CODE GENERATOR</p>
          </div>
  {/* ... theme toggle button stays the same ... */}
</header>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT PANEL: Configuration */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Input Types */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-500" />
                Data Configuration
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setQrType(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${qrType === tab.id 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Input Component */}
              <QRInputs 
                qrType={qrType} 
                qrData={qrData} 
                handleDataChange={handleDataChange} 
                errors={errors} 
              />
            </div>

            {/* Customization Options */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-500" />
                Appearance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colors */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Foreground Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={qrConfig.fgColor}
                        onChange={(e) => handleConfigChange('fgColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={qrConfig.fgColor}
                        onChange={(e) => handleConfigChange('fgColor', e.target.value)}
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={qrConfig.bgColor}
                        onChange={(e) => handleConfigChange('bgColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={qrConfig.bgColor}
                        onChange={(e) => handleConfigChange('bgColor', e.target.value)}
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Size ({qrConfig.size}px)</label>
                    <input 
                      type="range" 
                      min="128" max="512" step="32"
                      value={qrConfig.size}
                      onChange={(e) => handleConfigChange('size', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Error Correction Level</label>
                    <select 
                      value={qrConfig.level}
                      onChange={(e) => handleConfigChange('level', e.target.value)}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none"
                    >
                      <option value="L">Low (7%) - Best for simple data</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%) - Best if adding a logo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Preview & Recents */}
          <div className="space-y-6">
            
            {/* Preview Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center sticky top-8">
              <h2 className="text-lg font-semibold w-full mb-6">Live Preview</h2>
              
              <div 
                className="p-4 bg-white rounded-xl shadow-inner border border-gray-100 mb-6 flex justify-center items-center overflow-hidden w-full max-w-[300px] aspect-square"
                ref={qrRef}
              >
                {payload ? (
                  <QRCodeCanvas
                    value={payload}
                    size={qrConfig.size > 250 ? 250 : qrConfig.size} // Scale down visually so it doesn't break UI layout
                    fgColor={qrConfig.fgColor}
                    bgColor={qrConfig.bgColor}
                    level={qrConfig.level}
                    includeMargin={qrConfig.includeMargin}
                    marginSize={qrConfig.margin}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                ) : (
                  <div className="text-gray-400 text-sm text-center">
                    Enter data to generate <br/> QR code
                  </div>
                )}
              </div>

              {/* Warnings */}
              {contrastWarning && (
                <div className="w-full mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>{contrastWarning}</p>
                </div>
              )}

              {/* Download Button */}
              <button 
                onClick={handleDownload}
                disabled={!payload || Object.keys(errors).length > 0}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
            </div>

            {/* Recent QR Codes */}
            {recentQRs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  Recent Codes
                </h2>
                <div className="space-y-3">
                  {recentQRs.map((recent) => (
                    <button
                      key={recent.id}
                      onClick={() => loadRecent(recent)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left group"
                    >
                      <div>
                        <span className="block text-sm font-medium uppercase text-blue-600 dark:text-blue-400">{recent.type}</span>
                        <span className="block text-xs text-gray-500 truncate max-w-[180px]">
                          {recent.data.url || recent.data.text || recent.data.ssid || recent.data.email || recent.data.phone || 'QR Data'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{recent.date}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
