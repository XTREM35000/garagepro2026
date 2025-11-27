'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  onBlur?: () => void;
}

const countryCodes = [
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+216', country: 'Tunisie', flag: '🇹🇳' },
  { code: '+212', country: 'Maroc', flag: '🇲🇦' },
  { code: '+213', country: 'Algérie', flag: '🇩🇿' },
  { code: '+961', country: 'Liban', flag: '🇱🇧' }
];

/**
 * PhoneInput: Composant réutilisable pour saisir un numéro de téléphone
 * Gère l'indicatif pays (code) et le numéro séparément avec dropdown
 * Support complet des pays africains et moyen-orientaux
 *
 * @example
 * <PhoneInput
 *   value={phone}
 *   onChange={setPhone}
 *   label="Téléphone"
 *   required
 *   error={phoneError}
 * />
 */
export const PhoneInput = ({
  value,
  onChange,
  label = 'Téléphone',
  placeholder = '123456789',
  required = false,
  disabled = false,
  className = '',
  error,
  onBlur
}: PhoneInputProps) => {
  const [selectedCode, setSelectedCode] = useState('+225');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Initialiser la valeur par défaut Côte d'Ivoire si aucun value fourni
  useEffect(() => {
    if (typeof value === 'string' && value) {
      // Si une valeur existe, tenter d'extraire le code
      const match = value.match(/^\+(\d{1,3})/);
      if (match) {
        const code = `+${match[1]}`;
        const foundCode = countryCodes.find(c => c.code === code);
        if (foundCode) {
          setSelectedCode(code);
          const rest = value.replace(code, '').replace(/\D/g, '');
          setPhoneNumber(rest);
        }
      }
    }
  }, [value]);

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    const fullPhone = code + phoneNumber;
    onChange(fullPhone);
  };

  const handleNumberChange = (number: string) => {
    // Nettoyer le numéro (enlever les espaces et caractères non numériques)
    const cleanNumber = number.replace(/\D/g, '');
    setPhoneNumber(cleanNumber);
    const fullPhone = selectedCode + cleanNumber;
    onChange(fullPhone);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Phone className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      <div className="flex gap-2">
        <Select
          value={selectedCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          disabled={disabled}
          className={`w-32 text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={`${label} - country code`}
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </Select>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 text-sm ${error
              ? 'border-red-500 focus:ring-red-500'
              : 'focus:ring-[#128C7E]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={`${label} - number`}
          aria-describedby={error ? 'phone-error' : undefined}
        />
      </div>
      {error && (
        <p id="phone-error" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
