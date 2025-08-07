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

/**
 * 预设选项数据映射表
 * 用于根据optionsPreset字段动态加载对应的选项数据
 */
const PRESET_OPTIONS_MAP: Record<string, any> = {
  ethnicity: ethnicityOptions,      // 民族选项
  political: politicalOptions,      // 政治面貌选项
  education: educationOptions,      // 学历选项
  gender: genderOptions,            // 性别选项
  province: provinceOptions,        // 省份选项
  cascader: cascaderOptions,        // 省市区级联选项
  maritalStatus: maritalStatusOptions, // 婚姻状况选项
};

/**
 * 创建Zod校验模式
 * 根据字段配置动态生成校验规则
 * @param field 表单字段配置
 * @returns Zod校验模式
 */
export const createZodSchema = (field: any) => {
  let schema = z.any();

  // 必填校验
  schema = schema.refine((val: any) => val !== undefined && val !== null && val !== '', {
    message: `${field.label}为必填项`,
  });

  // 常用校验（正则表达式）
  if (field.validation?.custom && field.validation?.pattern) {
    const regex = new RegExp(field.validation.pattern);
    schema = schema.refine((val: any) => regex.test(val), {
      message: field.validation.message || '格式不正确',
    });
  }

  // 字符长度校验（仅在未选择常用校验时生效）
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

/**
 * FormField组件属性接口
 */
interface FormFieldProps {
  field: FormFieldType;           // 字段配置
  value?: any;                    // 字段值
  onChange?: (value: any) => void; // 值变化回调
  onBlur?: (value: any) => void;   // 失焦回调
  error?: string;                 // 错误信息
}

/**
 * 动态表单字段组件
 * 根据字段类型渲染对应的表单控件
 * 支持自定义校验触发时机和空格自动去除
 */
const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, onBlur, error }) => {
  // 动态获取选项数据
  // 如果配置了预设类型，则使用预设数据；否则使用自定义选项
  let options = field.options;
  if (field.optionsPreset && PRESET_OPTIONS_MAP[field.optionsPreset]) {
    options = PRESET_OPTIONS_MAP[field.optionsPreset];
  }

  /**
   * 渲染表单字段
   * 根据字段类型返回对应的Ant Design组件
   */
  const renderField = () => {
    // 通用属性
    const commonProps = {
      value,
      onChange,
      placeholder: field.placeholder,
      disabled: field.disabled,
    };

    // 计算输入框样式（根据配置的宽度百分比）
    const inputStyle = field.inputConfig?.widthPercent 
      ? { width: `${field.inputConfig.widthPercent}%` }
      : {};

    // 根据字段类型渲染不同的组件
    switch (field.type) {
      case 'input': {
        // 输入框组件
        const trigger = field.validation?.trigger || 'onBlur';
        const inputProps: any = {
          ...commonProps,
          style: inputStyle,
        };
        
        // 根据校验触发时机设置不同的事件处理
        if (trigger === 'onBlur') {
          // 失焦时触发校验，同时去除空格
          inputProps.onBlur = (e: React.FocusEvent<HTMLInputElement>) => onBlur?.(e.target.value.replace(/\s+/g, ''));
        } else if (trigger === 'onInput') {
          // 输入时触发校验，同时去除空格
          inputProps.onInput = (e: React.FormEvent<HTMLInputElement>) => onChange?.((e.target as HTMLInputElement).value.replace(/\s+/g, ''));
        } else {
          // 默认onChange触发校验，同时去除空格
          inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value.replace(/\s+/g, ''));
        }
        return <Input {...inputProps} />;
      }
      
      case 'textarea': {
        // 多行文本输入框
        const trigger = field.validation?.trigger || 'onBlur';
        const inputProps: any = {
          ...commonProps,
          rows: field.height || 4,
          style: inputStyle,
        };
        
        // 根据校验触发时机设置不同的事件处理
        if (trigger === 'onBlur') {
          inputProps.onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => onBlur?.(e.target.value.replace(/\s+/g, ''));
        } else if (trigger === 'onInput') {
          inputProps.onInput = (e: React.FormEvent<HTMLTextAreaElement>) => onChange?.((e.target as HTMLTextAreaElement).value.replace(/\s+/g, ''));
        } else {
          inputProps.onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value.replace(/\s+/g, ''));
        }
        return <Input.TextArea {...inputProps} />;
      }

      case 'radio':
        // 单选框组
        return (
          <Radio.Group {...commonProps} onChange={e => onChange?.(e.target.value)}>
            <Space direction="vertical">
              {options?.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'checkbox':
        // 复选框组
        return (
          <Checkbox.Group {...commonProps} onChange={val => onChange?.(val)}>
            <Space direction="vertical">
              {options?.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        );

      case 'select':
        // 下拉选择框
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
        // 级联选择器
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
        // 日期选择器
        return (
          <DatePicker
            {...commonProps}
            format="YYYY-MM-DD"
            style={inputStyle}
          />
        );

      case 'time':
        // 时间选择器
        return (
          <TimePicker
            {...commonProps}
            format="HH:mm:ss"
            style={inputStyle}
          />
        );

      case 'rating':
        // 评分组件
        return (
          <Rate
            {...commonProps}
            count={field.ratingConfig?.max || 5}
            allowHalf={field.ratingConfig?.allowHalf}
          />
        );

      case 'upload':
        // 文件上传组件
        return (
          <Upload
            {...commonProps}
            accept={field.uploadConfig?.accept || 'image/*'}
            maxCount={field.uploadConfig?.maxCount || 1}
            beforeUpload={() => false} // 阻止自动上传，仅用于文件选择
            listType="picture-card"
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        );

      // 特殊字段类型（预设的常用字段）
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
        // 默认渲染为普通输入框
        return <Input {...commonProps} />;
    }
  };

  return (
    <div>
      {renderField()}
      {/* 显示错误信息 */}
      {error && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default FormField; 