export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
  custom?: string; // 常用校验类型
  trigger?: 'onBlur' | 'onChange' | 'onInput'; // 校验触发时机
}

export interface InputConfig {
  widthPercent?: number; // 输入框宽度百分比 (50-100)
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

export interface DesignerField {
  id: string;
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  span?: number; // 栅格占位
  width?: number;
  height?: number;
  disabled?: boolean;
  validation?: ValidationRule;
  inputConfig?: InputConfig;
  ratingConfig?: RatingConfig;
  uploadConfig?: UploadConfig;
  options?: Array<{ label: string; value: string | number }>;
  optionsPreset?: string; // 预设选项类型
}

export interface ComponentItem {
  id: string;
  type: string;
  name: string;
  icon: string;
  category: 'basic' | 'advanced' | 'custom';
  defaultConfig: Omit<DesignerField, 'id'>;
}

export interface SavedConfig {
  id: string;
  name: string;
  config: {
    title: string;
    fields: Omit<DesignerField, 'id'>[];
    layout: string;
    responsive: boolean;
  };
  createTime: string;
  updateTime: string;
} 