import React from 'react';
import {
  Input,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  TimePicker,
  Rate,
  Upload,
  Form,
  Space,
  Cascader,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormField as FormFieldType } from '../types/form';
import { ethnicityOptions, politicalOptions, educationOptions, genderOptions, provinceOptions, cascaderOptions, maritalStatusOptions } from '../data/options';
import { z } from 'zod';

const PRESET_OPTIONS_MAP: Record<string, any> = {
  ethnicity: ethnicityOptions,
  political: politicalOptions,
  education: educationOptions,
  gender: genderOptions,
  province: provinceOptions,
  cascader: cascaderOptions,
  maritalStatus: maritalStatusOptions,
};

export const createZodSchema = (field: any) => {
  let schema = z.any();

  // 必填
  schema = schema.refine((val: any) => val !== undefined && val !== null && val !== '', {
    message: `${field.label}为必填项`,
  });

  // 常用校验
  if (field.validation?.custom && field.validation?.pattern) {
    const regex = new RegExp(field.validation.pattern);
    schema = schema.refine((val: any) => regex.test(val), {
      message: field.validation.message || '格式不正确',
    });
  }

  // 最小/最大长度
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

interface FormFieldProps {
  field: FormFieldType;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  // 动态获取options
  let options = field.options;
  if (field.optionsPreset && PRESET_OPTIONS_MAP[field.optionsPreset]) {
    options = PRESET_OPTIONS_MAP[field.optionsPreset];
  }

  const renderField = () => {
    const commonProps = {
      value,
      onChange,
      placeholder: field.placeholder,
      disabled: field.disabled,
    };

    // 计算输入框样式
    const inputStyle = field.inputConfig?.widthPercent 
      ? { width: `${field.inputConfig.widthPercent}%` }
      : {};

    switch (field.type) {
      case 'input': {
        const trigger = field.validation?.trigger || 'onBlur';
        const inputProps: any = {
          ...commonProps,
          style: inputStyle,
        };
        if (trigger === 'onBlur') {
          inputProps.onBlur = e => onChange?.(e.target.value.replace(/\s+/g, ''));
        } else if (trigger === 'onInput') {
          inputProps.onInput = e => onChange?.(e.target.value.replace(/\s+/g, ''));
        } else {
          inputProps.onChange = e => onChange?.(e.target.value.replace(/\s+/g, ''));
        }
        return <Input {...inputProps} />;
      }
      case 'textarea': {
        const trigger = field.validation?.trigger || 'onBlur';
        const inputProps: any = {
          ...commonProps,
          rows: field.height || 4,
          style: inputStyle,
        };
        if (trigger === 'onBlur') {
          inputProps.onBlur = e => onChange?.(e.target.value.replace(/\s+/g, ''));
        } else if (trigger === 'onInput') {
          inputProps.onInput = e => onChange?.(e.target.value.replace(/\s+/g, ''));
        } else {
          inputProps.onChange = e => onChange?.(e.target.value.replace(/\s+/g, ''));
        }
        return <Input.TextArea {...inputProps} />;
      }

      case 'radio':
        return (
          <Radio.Group {...commonProps} onChange={e => onChange?.(e.target.value)}>
            <Space direction="vertical">
              {options?.map((option) => (
                <Radio key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'checkbox':
        return (
          <Checkbox.Group {...commonProps} onChange={val => onChange?.(val)}>
            <Space direction="vertical">
              {options?.map((option) => (
                <Checkbox key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            placeholder={field.placeholder || '请选择'}
            options={options}
            style={inputStyle}
            onChange={val => onChange?.(val)}
          />
        );

      case 'cascader':
        return (
          <Cascader
            {...commonProps}
            placeholder={field.placeholder || '请选择'}
            options={options}
            style={inputStyle}
            showSearch
            expandTrigger="hover"
            onChange={val => onChange?.(val)}
          />
        );

      case 'date':
        return (
          <DatePicker
            {...commonProps}
            format={field.dateConfig?.format || 'YYYY-MM-DD'}
            showTime={field.dateConfig?.showTime}
            style={inputStyle}
          />
        );

      case 'time':
        return (
          <TimePicker
            {...commonProps}
            format="HH:mm:ss"
            style={inputStyle}
          />
        );

      case 'rating':
        return (
          <Rate
            {...commonProps}
            count={field.ratingConfig?.max || 5}
            allowHalf={field.ratingConfig?.allowHalf}
          />
        );

      case 'upload':
        return (
          <Upload
            {...commonProps}
            accept={field.uploadConfig?.accept || 'image/*'}
            maxCount={field.uploadConfig?.maxCount || 1}
            beforeUpload={() => false} // 阻止自动上传
            listType="picture-card"
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        );

      // 特殊字段类型
      case 'idcard':
        return <Input {...commonProps} placeholder="请输入身份证号" style={inputStyle} />;

      case 'phone':
        return <Input {...commonProps} placeholder="请输入手机号" />;

      case 'province':
        return (
          <Select
            {...commonProps}
            placeholder="请选择省份"
            options={provinceOptions}
            showSearch
            style={inputStyle}
          />
        );

      case 'name':
        return <Input {...commonProps} placeholder="请输入姓名" />;

      case 'age':
        return <Input {...commonProps} placeholder="请输入年龄" type="number" />;

      case 'ethnicity':
        return (
          <Select
            {...commonProps}
            placeholder="请选择民族"
            options={ethnicityOptions}
            showSearch
            style={inputStyle}
          />
        );

      case 'political':
        return (
          <Select
            {...commonProps}
            placeholder="请选择政治面貌"
            options={politicalOptions}
            style={inputStyle}
          />
        );

      case 'wechat':
        return <Input {...commonProps} placeholder="请输入微信号" />;

      case 'company':
        return <Input {...commonProps} placeholder="请输入公司名称" />;

      case 'position':
        return <Input {...commonProps} placeholder="请输入职位" />;

      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div>
      {renderField()}
      {error && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default FormField; 