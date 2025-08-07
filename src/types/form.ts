export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
  custom?: string; // Common validation type
  trigger?: 'onBlur' | 'onChange' | 'onInput'; // 校验触发时机
}

export interface InputConfig {
  widthPercent?: number;
}

export interface RatingConfig {
  max?: number;
  allowHalf?: boolean;
}

export interface UploadConfig {
  accept?: string;
  maxSize?: number;
  maxCount?: number;
}

export interface FormField {
  id: string;
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  span?: number;
  width?: number;
  height?: number;
  disabled?: boolean;
  validation?: ValidationRule;
  inputConfig?: InputConfig;
  ratingConfig?: RatingConfig;
  uploadConfig?: UploadConfig;
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: any;
}

export interface FormConfig {
  title: string;
  layout?: 'horizontal' | 'vertical' | 'inline';
  fields: FormField[];
  responsive?: boolean;
}

export interface FormData {
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
} 