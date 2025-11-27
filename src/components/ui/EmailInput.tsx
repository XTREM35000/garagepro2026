'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (email: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  onBlur?: () => void;
}

const emailDomains = [
  { value: '@gmail.com', label: 'Gmail' },
  { value: '@yahoo.com', label: 'Yahoo' },
  { value: '@yahoo.fr', label: 'Yahoo France' },
  { value: '@outlook.com', label: 'Outlook' },
  { value: '@outlook.fr', label: 'Outlook France' },
  { value: '@hotmail.com', label: 'Hotmail' },
  { value: '@automaster.ci', label: 'AutoMaster CI' },
  { value: '@orange.ci', label: 'Orange CI' },
  { value: '@mtn.ci', label: 'MTN CI' },
  { value: '@moov.ci', label: 'Moov CI' }
];

/**
 * EmailInput: Composant réutilisable pour saisir une adresse email
 * Gère l'affichage du local part et du domaine séparément avec dropdown
 * Support du copier-coller d'emails complets et nettoyage auto des caractères invalides
 *
 * @example
 * <EmailInput
 *   value={email}
 *   onChange={setEmail}
 *   label="Adresse email"
 *   required
 *   error={emailError}
 * />
 */
export const EmailInput = ({
  value,
  onChange,
  label = 'Email',
  placeholder = 'nom.prenom (sans espaces)',
  required = false,
  disabled = false,
  className = '',
  error,
  onBlur
}: EmailInputProps) => {
  const [localPart, setLocalPart] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('@gmail.com');

  // Synchroniser l'état interne avec la valeur externe
  useEffect(() => {
    if (typeof value === 'string' && value.includes('@')) {
      const [local, domain] = value.split('@');
      setLocalPart((local || '').toLowerCase());
      if (domain) setSelectedDomain(`@${domain}`);
    }
  }, [value]);

  /**
   * Gère les changements du local part (avant le @)
   * - Nettoie les caractères spéciaux et espaces
   * - Support copier-coller d'email complet
   * - Détecte et applique le domaine si collé avec full email
   */
  const handleLocalPartChange = (part: string) => {
    let input = part || '';

    // Si l'utilisateur a collé un email complet, le splitter et appliquer le domaine
    if (input.includes('@')) {
      const [local, domain] = input.split('@');
      input = local || '';
      if (domain) {
        const domainWithAt = `@${domain.replace(/^@/, '')}`;
        if (emailDomains.some(d => d.value === domainWithAt)) {
          setSelectedDomain(domainWithAt);
        }
      }
    }

    // Nettoyer: supprimer @, espaces et forcer minuscules
    let cleanPart = input.replace(/[@\s]/g, '').toLowerCase();

    // Si l'utilisateur a tapé un suffixe de domaine (ex: 'namegmail.com'), le retirer
    for (const d of emailDomains) {
      const dom = d.value.replace('@', '').toLowerCase();
      if (cleanPart.endsWith(dom)) {
        cleanPart = cleanPart.slice(0, -dom.length);
        if (cleanPart.endsWith('.')) cleanPart = cleanPart.slice(0, -1);
        break;
      }
    }

    setLocalPart(cleanPart);
    const fullEmail = cleanPart + selectedDomain;
    onChange(fullEmail);
  };

  /**
   * Gère les changements du domaine via le dropdown
   */
  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    const fullEmail = (localPart || '').toLowerCase() + domain;
    onChange(fullEmail);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Mail className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={localPart}
          onChange={(e) => handleLocalPartChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 text-sm ${error
              ? 'border-red-500 focus:ring-red-500'
              : 'focus:ring-[#128C7E]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={`${label} - local part`}
          aria-describedby={error ? 'email-error' : undefined}
        />
        <Select
          value={selectedDomain}
          onChange={(e) => handleDomainChange(e.target.value)}
          disabled={disabled}
          className={`w-40 text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={`${label} - domain`}
        >
          {emailDomains.map((domain) => (
            <option key={domain.value} value={domain.value}>
              {domain.label}
            </option>
          ))}
        </Select>
      </div>
      {error && (
        <p id="email-error" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
