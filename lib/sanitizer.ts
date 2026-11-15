/**
 * Wellness Clinical Data Sanitization & Input Validation Engine
 * Ensures patient safety, prevents XSS, and enforces clinical formatting.
 */

export interface ValidationResult<T = string> {
  isValid: boolean;
  value?: T;
  error?: string;
}

/**
 * Sanitizes arbitrary text input by trimming, stripping script/HTML tags, and constraining length.
 */
export function sanitizeText(raw: string, maxLength: number = 250): string {
  if (!raw) return '';
  
  // Strip dangerous HTML/script injection tags
  const stripped = raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();

  // Enforce boundary length
  return stripped.slice(0, maxLength);
}

/**
 * Validates pharmaceutical medication naming conventions
 */
export function validateMedicationName(name: string): ValidationResult<string> {
  const clean = sanitizeText(name, 100);
  if (!clean || clean.length < 2) {
    return {
      isValid: false,
      error: 'Medication name must be at least 2 characters long.',
    };
  }

  // Check for allowed characters (letters, numbers, spaces, hyphens, slashes)
  const validPattern = /^[a-zA-Z0-9\s\-/'()]+$/;
  if (!validPattern.test(clean)) {
    return {
      isValid: false,
      error: 'Medication name contains invalid characters.',
    };
  }

  return {
    isValid: true,
    value: clean,
  };
}

/**
 * Validates pharmaceutical dosage formatting (e.g., '10mg', '500 mg', '5 ml', '2 puffs', '1 tablet')
 */
export function validateDosage(dosage: string): ValidationResult<string> {
  const clean = sanitizeText(dosage, 40);
  if (!clean) {
    return {
      isValid: false,
      error: 'Dosage is required (e.g., 10mg, 500 mg, 1 tablet).',
    };
  }

  const dosagePattern = /^\d+(\.\d+)?\s*(mg|mcg|g|ml|tablets?|capsules?|puffs?|drops?|units?|iu|patch|teaspoon|tbsp)?$/i;
  if (!dosagePattern.test(clean)) {
    return {
      isValid: false,
      error: 'Please enter a standard clinical dosage format (e.g. "10mg", "2.5 ml", "1 tablet").',
    };
  }

  return {
    isValid: true,
    value: clean,
  };
}

/**
 * Validates medical condition or diagnosis label
 */
export function validateCondition(condition: string): ValidationResult<string> {
  const clean = sanitizeText(condition, 120);
  if (!clean || clean.length < 2) {
    return {
      isValid: false,
      error: 'Medical condition or indication must be specified.',
    };
  }

  return {
    isValid: true,
    value: clean,
  };
}
