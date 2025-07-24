import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the settings interface
interface Settings {
  aiEnhanced: boolean;
  anthropicApiKey: string | null;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  soundEffects: boolean;
  highContrast: boolean;
}

// Define the settings context type
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Create the default settings
const defaultSettings: Settings = {
  aiEnhanced: false,
  anthropicApiKey: null,
  theme: 'system',
  notificationsEnabled: true,
  soundEffects: false,
  highContrast: false
};

// Create the settings context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Create the settings provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('anuva_settings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);

  // Update settings function
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Save to localStorage
      localStorage.setItem('anuva_settings', JSON.stringify(updatedSettings));
      
      // Show toast when AI enhancement is toggled
      if (newSettings.aiEnhanced !== undefined && 
          newSettings.aiEnhanced !== prevSettings.aiEnhanced) {
        if (newSettings.aiEnhanced) {
          toast({
            title: "AI Enhancement Enabled",
            description: "Clinical documentation and decision support are now AI-powered.",
          });
        } else {
          toast({
            title: "AI Enhancement Disabled",
            description: "Using standard documentation workflows.",
          });
        }
      }
      
      return updatedSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Create the useSettings hook
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  const toggleHighContrast = () => {
    context.updateSettings({ highContrast: !context.settings.highContrast });
    
    // Apply high contrast by toggling a class on the document body
    if (!context.settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };
  
  return {
    ...context,
    toggleHighContrast
  };
}