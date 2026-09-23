// src/components/QRInputs.jsx
import React from 'react';

export default function QRInputs({ qrType, qrData, handleDataChange, errors }) {
  switch (qrType) {
    case 'url':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input 
              type="url" 
              value={qrData.url || ''}
              onChange={(e) => handleDataChange('url', e.target.value)}
              placeholder="https://example.com"
              className={`w-full p-2.5 rounded-lg border bg-white dark:bg-gray-700 outline-none transition-colors
                ${errors.url ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/50'}`}
            />
            {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
          </div>
        </div>
      );
      
    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Plain Text</label>
            <textarea 
              value={qrData.text || ''}
              onChange={(e) => handleDataChange('text', e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              className={`w-full p-2.5 rounded-lg border bg-white dark:bg-gray-700 outline-none transition-colors resize-none
                ${errors.text ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/50'}`}
            />
            {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              value={qrData.email || ''}
              onChange={(e) => handleDataChange('email', e.target.value)}
              placeholder="contact@example.com"
              className={`w-full p-2.5 rounded-lg border bg-white dark:bg-gray-700 outline-none transition-colors
                ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/50'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
            <input 
              type="text" 
              value={qrData.subject || ''}
              onChange={(e) => handleDataChange('subject', e.target.value)}
              placeholder="Email subject"
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message (Optional)</label>
            <textarea 
              value={qrData.body || ''}
              onChange={(e) => handleDataChange('body', e.target.value)}
              placeholder="Write your email body here..."
              rows={3}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-none"
            />
          </div>
        </div>
      );

    case 'phone':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={qrData.phone || ''}
              onChange={(e) => handleDataChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
              className={`w-full p-2.5 rounded-lg border bg-white dark:bg-gray-700 outline-none transition-colors
                ${errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/50'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Network Name (SSID)</label>
            <input 
              type="text" 
              value={qrData.ssid || ''}
              onChange={(e) => handleDataChange('ssid', e.target.value)}
              placeholder="MyWiFiNetwork"
              className={`w-full p-2.5 rounded-lg border bg-white dark:bg-gray-700 outline-none transition-colors
                ${errors.ssid ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/50'}`}
            />
            {errors.ssid && <p className="text-red-500 text-xs mt-1">{errors.ssid}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="text" 
              value={qrData.password || ''}
              onChange={(e) => handleDataChange('password', e.target.value)}
              placeholder="Network password"
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Encryption</label>
              <select 
                value={qrData.encryption || 'WPA'}
                onChange={(e) => handleDataChange('encryption', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            
            <div className="flex items-center mt-7">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={qrData.hidden || false}
                  onChange={(e) => handleDataChange('hidden', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium">Hidden Network</span>
              </label>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}