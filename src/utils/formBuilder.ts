import type { FormConfig, FormField } from '../types/form';
import { educationOptions, genderOptions, ethnicityOptions, politicalOptions, provinceOptions } from '../data/options';

// 字段模板
export const fieldTemplates: Record<string, Partial<FormField>> = {
    name: {
      type: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
      validation: { required: true, custom: 'chinese_name', message: '请输入2-4位中文姓名' },
      width: 300,
    },
    phone: {
      type: 'phone',
      label: '手机号',
      placeholder: '请输入手机号',
      validation: { required: true, custom: 'phone', message: '请输入正确的手机号' },
      width: 300,
    },
    email: {
      type: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      validation: { required: true, custom: 'email', message: '请输入正确的邮箱格式' },
      width: 300,
    },
    age: {
      type: 'age',
      label: '年龄',
      placeholder: '请输入年龄',
      validation: { required: true, custom: 'age', message: '请输入有效年龄（0-150）' },
      width: 300,
    },
    gender: {
      type: 'radio',
      label: '性别',
      options: genderOptions,
      validation: { required: true },
    },
    education: {
      type: 'radio',
      label: '学历',
      options: educationOptions,
      validation: { required: true },
    },
    // ... 按需添加其它字段模板 ...
  };

export class FormBuilder {
  private config: FormConfig;

  constructor(title: string = '动态表单') {
    this.config = {
      title,
      fields: [],
      layout: 'vertical',
      responsive: true,
    };
  }

  addField(fieldName: string, customConfig?: Partial<FormField>): this {
    const template = fieldTemplates[fieldName];
    if (!template) throw new Error(`未知的字段模板: ${fieldName}`);
    const field: FormField = { ...template, name: fieldName, ...customConfig } as FormField;
    this.config.fields.push(field);
    return this;
  }

  addCustomField(field: FormField): this {
    this.config.fields.push(field);
    return this;
  }

  build(): FormConfig {
    return { ...this.config };
  }

  static createUserInfoForm(): FormConfig {
    return new FormBuilder('用户信息表单')
      .addField('name')
      // ... 按需添加其它字段 ...
      .build();
  }

  static createContactForm(): FormConfig {
    return new FormBuilder('联系表单')
      .addField('name')
      // ... 按需添加其它字段 ...
      .build();
  }
}