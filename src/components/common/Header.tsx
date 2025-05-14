import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, ChevronDown, Search, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Input from '../ui/Input';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { logout, performSearch } = useApp();
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search with debounce
  const debouncedSearch = useCallback(
    (value: string) => {
      if (value.trim()) {
        performSearch(value);
      }
    },
    [performSearch]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileOpen) setProfileOpen(false);
  };
  
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          {title}
          {subtitle && (
            <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {subtitle}
            </span>
          )}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search orders, customers, products..."
            variant="search"
            leftIcon={<Search className="h-4 w-4" />}
            className="w-64"
          />
        </div>
        
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className={cn(
              "p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-200 relative",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              notificationsOpen && "bg-gray-100"
            )}
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transform transition-all duration-200 origin-top">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-gray-800">New order received</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-gray-800">Payment successful</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="p-2 border-t border-gray-200">
                <button className="w-full py-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center transform group-hover:scale-105 transition-all duration-200">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-800">Admin User</span>
                <ChevronDown 
                  size={16} 
                  className={cn(
                    'ml-1 text-gray-500 transition-transform duration-200',
                    profileOpen && 'transform rotate-180'
                  )} 
                />
              </div>
            </div>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transform transition-all duration-200 origin-top">
              <div className="py-1">
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" 
                  onClick={() => navigate('/profile')}
                >
                  <User size={16} className="mr-2" />
                  Edit Profile
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" 
                  onClick={() => navigate('/settings')}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <HelpCircle size={16} className="mr-2" />
                  Help Center
                </button>
                <div className="border-t border-gray-100" />
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;