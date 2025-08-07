import { z } from 'zod';

// 身份证号校验
export const validateIdCard = (value: string): boolean => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(value);
};

// 手机号校验
export const validatePhone = (value: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(value);
};

// 邮箱校验
export const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

// 中文姓名校验
export const validateChineseName = (value: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,4}$/;
  return nameRegex.test(value);
};

// 整数校验
export const validateInteger = (value: string): boolean => {
  return /^\d+$/.test(value) && parseInt(value) > 0;
};

// 年龄校验
export const validateAge = (value: string): boolean => {
  const age = parseInt(value);
  return !isNaN(age) && age >= 0 && age <= 150;
};

// 自定义校验规则映射
export const customValidators: Record<string, (value: any) => boolean> = {
  idcard: validateIdCard,
  phone: validatePhone,
  email: validateEmail,
  chinese_name: validateChineseName,
  integer: validateInteger,
  age: validateAge,
};

// Zod 校验模式
export const createZodSchema = (field: any) => {
  let schema: any;
  switch (field.type) {
    case 'input':
    case 'textarea':
    case 'radio':
    case 'select':
    case 'date':
    case 'time':
      schema = z.string();
      break;
    case 'checkbox':
      schema = z.array(z.string());
      break;
    case 'rating':
      schema = z.number();
      break;
    default:
      schema = z.any();
  }

  // 必填（所有类型都加）
  schema = schema.refine((val: any) => val !== undefined && val !== null && val !== '', {
    message: `${field.label}为必填项`,
  });

  // 常用校验（pattern+message）
  if (field.validation?.custom && field.validation?.pattern) {
    const regex = new RegExp(field.validation.pattern);
    schema = schema.refine((val: any) => regex.test(val), {
      message: field.validation.message || '格式不正确',
    });
  }

  // 最小/最大字符数（仅无常用校验时生效）
  if (!field.validation?.custom) {
    if (field.validation?.min) {
      schema = schema.refine((val: any) => typeof val === 'string' ? val.length >= field.validation.min : true, {
        message: field.validation.message || `最少${field.validation.min}个字符`,
      });
    }
    if (field.validation?.max) {
      schema = schema.refine((val: any) => typeof val === 'string' ? val.length <= field.validation.max : true, {
        message: field.validation.message || `最多${field.validation.max}个字符`,
      });
    }
  }

  return schema;
}; 