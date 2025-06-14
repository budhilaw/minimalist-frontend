import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for the terminal-like effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const email = settings?.site?.social_media_links?.email || 'hello@example.com';
  const location = 'Remote'; // You can make this configurable later
  const timezone = 'UTC'; // You can make this configurable later

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const openEmailClient = () => {
    window.location.href = `mailto:${email}?subject=Project Inquiry&body=Hi there,%0D%0A%0D%0AI'd like to discuss a project with you.%0D%0A%0D%0ABest regards,`;
  };

  return (
    <>
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
      
      <section id="contact" className="text-white relative overflow-hidden min-h-screen">
        {/* Animated background grid - Full viewport */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        {/* Floating particles - Full viewport */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Content with full width */}
        <div className="relative z-10 w-full">
          {/* Terminal Header - Full Width */}
          <div className="mx-6 bg-gray-800 rounded-t-lg border border-gray-700 p-4 mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-gray-400 text-sm font-mono">contact.sh</span>
            </div>
          </div>

          {/* Terminal Content - Full Width with Pitch Black Background */}
          <div className="mx-6 bg-black rounded-b-lg border-l border-r border-b border-gray-700 p-8 font-mono text-sm">
            <div className="max-w-6xl mx-auto">
              {/* Terminal prompt */}
              <div className="mb-6">
                <span className="text-green-400">visitor@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~/contact</span>
                <span className="text-white">$ ./hire_me.sh</span>
                <span className="animate-pulse text-green-400 ml-1">|</span>
              </div>

              {/* System info */}
              <div className="mb-8 space-y-2 text-gray-300">
                <div className="flex items-center space-x-4">
                  <span className="text-blue-400">System:</span>
                  <span>Contact Interface v2.0</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-400">Status:</span>
                  <span className="text-green-400">● AVAILABLE FOR HIRE</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-400">Location:</span>
                  <span>{location}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-400">Time:</span>
                  <span>{currentTime.toLocaleTimeString()} {timezone}</span>
                </div>
              </div>

              {/* Main message */}
              <div className="mb-8">
                <div className="text-green-400 mb-4">
                  ┌─ HIRE_ME_PROTOCOL_INITIATED ─┐
                </div>
                <div className="pl-4 space-y-3 text-gray-100">
                  <p>Looking to build something amazing?</p>
                  <p>Skip the forms. Let's talk directly.</p>
                  <p className="text-yellow-400">→ Email is the fastest way to reach me</p>
                </div>
                <div className="text-green-400 mt-4">
                  └─────────────────────────────┘
                </div>
              </div>

              {/* Email section */}
              <div className="mb-8 bg-gray-900 border border-gray-700 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <Icon icon="mdi:email" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
                    Primary Contact
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">ONLINE</span>
                  </div>
                </div>
                
                <div className="bg-black rounded-lg p-3 sm:p-4 mb-4 border border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <span className="text-blue-300 font-mono text-sm sm:text-lg break-all">{email}</span>
                    <button
                      onClick={copyEmail}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors w-full sm:w-auto"
                    >
                      <Icon 
                        icon={copied ? "mdi:check" : "mdi:content-copy"} 
                        className={`w-4 h-4 ${copied ? 'text-green-400' : 'text-gray-400'}`} 
                      />
                      <span className={`text-xs ${copied ? 'text-green-400' : 'text-gray-400'}`}>
                        {copied ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={openEmailClient}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Icon icon="mdi:rocket-launch" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Launch Email Client</span>
                </button>
              </div>

              {/* Quick info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon icon="mdi:clock-fast" className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Response Time</span>
                  </div>
                  <p className="text-gray-300 text-sm">Usually within 24 hours</p>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon icon="mdi:handshake" className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Project Types</span>
                  </div>
                  <p className="text-gray-300 text-sm">Web apps, APIs, consulting</p>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon icon="mdi:calendar-check" className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Availability</span>
                  </div>
                  <p className="text-gray-300 text-sm">Open for new projects</p>
                </div>
              </div>

              {/* Terminal footer */}
              <div className="border-t border-gray-800 pt-6 mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-gray-500 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <span>Process: contact_handler</span>
                    <span>PID: 1337</span>
                    <span>Uptime: {Math.floor(Date.now() / 1000 / 60 / 60 / 24)} days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Ready to receive connections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional contact methods */}
          <div className="mt-12 max-w-2xl mx-auto px-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Icon icon="mdi:network" className="w-6 h-6 mr-3 text-blue-400" />
                Alternative Channels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings?.site?.social_media_links?.linkedin && (
                  <a
                    href={settings.site.social_media_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors group"
                  >
                    <Icon icon="mdi:linkedin" className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                    <span className="text-gray-300 group-hover:text-white">LinkedIn</span>
                    <Icon icon="mdi:external-link" className="w-4 h-4 text-gray-500 ml-auto" />
                  </a>
                )}
                {settings?.site?.social_media_links?.github && (
                  <a
                    href={settings.site.social_media_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors group"
                  >
                    <Icon icon="mdi:github" className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <span className="text-gray-300 group-hover:text-white">GitHub</span>
                    <Icon icon="mdi:external-link" className="w-4 h-4 text-gray-500 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}; 