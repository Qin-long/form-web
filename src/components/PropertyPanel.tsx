import React from 'react';
import { Card, Form, Input, InputNumber, Switch, Select, Divider } from 'antd';
import type { DesignerField } from '../types/designer';
import { ethnicityOptions, politicalOptions, educationOptions, genderOptions, provinceOptions, cascaderOptions, maritalStatusOptions } from '../data/options';

/**
 * 预设选项类型定义
 */
const PRESET_TYPES = ['ethnicity', 'political', 'education', 'gender', 'province', 'cascader', 'maritalStatus'] as const;
type PresetType = typeof PRESET_TYPES[number];

/**
 * 预设选项数据映射表
 * 用于根据预设类型获取对应的选项数据
 */
const PRESET_OPTIONS_MAP: Record<PresetType, { label: string; value: string }[] | any[]> = {
  ethnicity: ethnicityOptions,      // 民族选项
  political: politicalOptions,      // 政治面貌选项
  education: educationOptions,      // 学历选项
  gender: genderOptions,            // 性别选项
  province: provinceOptions,        // 省份选项
  cascader: cascaderOptions,        // 省市区级联选项
  maritalStatus: maritalStatusOptions, // 婚姻状况选项
};

/**
 * 预设选项标签配置
 * 用于在属性面板中显示预设选项的选择项
 */
const PRESET_OPTIONS_LABELS = [
  { label: '民族', value: 'ethnicity' },
  { label: '政治面貌', value: 'political' },
  { label: '学历', value: 'education' },
  { label: '性别', value: 'gender' },
  { label: '省份', value: 'province' },
  { label: '省市区', value: 'cascader' },
  { label: '婚姻状况', value: 'maritalStatus' },
];

/**
 * 预设类型到中文名称的映射
 * 用于自动设置字段标签
 */
const PRESET_TYPE_LABELS: Record<PresetType, string> = {
  ethnicity: '民族',
  political: '政治面貌',
  education: '学历',
  gender: '性别',
  province: '省份',
  cascader: '省市区',
  maritalStatus: '婚姻状况',
};

/**
 * 常用校验规则配置
 * 提供预设的校验规则，包括正则表达式和错误提示
 */
const COMMON_VALIDATIONS = [
  {
    label: '无',
    value: '',
    pattern: '',
    message: '',
  },
  {
    label: '姓名（只支持中文）',
    value: 'chinese_name',
    pattern: '^[\u4e00-\u9fa5]{2,4}$',
    message: '请输入2-4位中文姓名',
  },
  {
    label: '手机号',
    value: 'phone',
    pattern: '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$',
    message: '请输入正确的手机号',
  },
  {
    label: '邮箱',
    value: 'email',
    pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$',
    message: '请输入正确的邮箱格式',
  },
  {
    label: '年龄',
    value: 'age',
    pattern: '^(?:1[01][0-9]|120|[1-9]?[0-9])$',
    message: '请输入0-120之间的年龄',
  },
];

/**
 * PropertyPanel组件属性接口
 */
interface PropertyPanelProps {
  selectedField: DesignerField | null;  // 当前选中的字段
  onFieldUpdate: (fieldId: string, updates: Partial<DesignerField>) => void; // 字段更新回调
}

/**
 * 属性配置面板组件
 * 用于配置选中字段的各种属性，包括基本属性、校验规则、选项配置等
 */
const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedField, onFieldUpdate }) => {
  const [form] = Form.useForm();
  const [optionSource, setOptionSource] = React.useState<'custom'|'preset'>('custom');
  const [presetType, setPresetType] = React.useState<PresetType | undefined>(undefined);

  /**
   * 监听选中字段变化，更新表单数据
   * 只依赖selectedField?.id，避免死循环
   */
  React.useEffect(() => {
    if (selectedField) {
      form.setFieldsValue(selectedField);
    } else {
      form.resetFields();
    }
  }, [selectedField?.id]);

  /**
   * 处理表单值变化
   * 特殊处理validation字段，确保修改message或trigger时保留常用校验配置
   */
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (selectedField) {
      // 如果修改的是validation字段，需要特殊处理以保留常用校验配置
      if (changedValues.validation) {
        const currentValidation = selectedField.validation || {};
        const newValidation = { ...currentValidation, ...changedValues.validation };
        
        // 如果修改的是message或trigger，保留现有的custom和pattern
        if (changedValues.validation.message !== undefined || changedValues.validation.trigger !== undefined) {
          // 保留现有的常用校验配置
          onFieldUpdate(selectedField.id, {
            validation: newValidation
          });
        } else {
          // 其他validation字段的修改，正常处理
          onFieldUpdate(selectedField.id, changedValues);
        }
      } else {
        // 非validation字段的修改，正常处理
        onFieldUpdate(selectedField.id, changedValues);
      }
    }
  };

  /**
   * 选项来源切换处理
   * 在自定义选项和预设选项之间切换
   */
  const handleOptionSourceChange = (val: 'custom'|'preset') => {
    setOptionSource(val);
    if (val === 'custom') {
      setPresetType(undefined);
      // 不自动清空options，保留自定义
    }
  };

  /**
   * 预设类型切换处理
   * 选择预设类型时自动更新字段的标签、名称和选项数据
   */
  const handlePresetTypeChange = (val: PresetType) => {
    setPresetType(val);
    if (selectedField) {
      const presetLabel = PRESET_TYPE_LABELS[val];
      onFieldUpdate(selectedField.id, {
        optionsPreset: val,
        options: undefined, // 清空options，使用预设数据
        label: presetLabel,
        name: val
      });
      form.setFieldsValue({
        optionsPreset: val,
        options: undefined,
        label: presetLabel,
        name: val
      });
    }
  };

  // 如果没有选中字段，显示提示信息
  if (!selectedField) {
    return (
      <Card 
        title="属性配置" 
        size="small" 
        style={{ 
          width: 300,
          height: 'calc(100vh - 120px)',
          overflow: 'hidden'
        }}
      >
        <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          请选择一个组件进行配置
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="属性配置" 
      size="small" 
      style={{ 
        width: 300,
        height: 'calc(100vh - 120px)',
        overflow: 'hidden'
      }}
      bodyStyle={{
        height: 'calc(100% - 57px)',
        overflowY: 'auto',
        padding: '12px'
      }}
    >
      <Form
        form={form}
        layout="vertical"
        size="small"
        onValuesChange={handleValuesChange}
      >
        {/* 基本属性配置 */}
        <Form.Item label="字段名称" name="name">
          <Input placeholder="请输入字段名称" />
        </Form.Item>

        <Form.Item label="显示标签" name="label">
          <Input placeholder="请输入显示标签" />
        </Form.Item>

        <Form.Item label="占位符" name="placeholder">
          <Input placeholder="请输入占位符" />
        </Form.Item>

        {/* 布局设置 */}
        <Divider orientation="left">布局设置</Divider>

        <Form.Item label="栅格占位（span）" name="span">
          <InputNumber
            min={1}
            max={24}
            style={{ width: '100%' }}
            placeholder="1-24列"
            addonAfter="/ 24"
          />
        </Form.Item>

        <Form.Item label="输入框宽度" name={['inputConfig', 'widthPercent']}>
          <InputNumber
            min={50}
            max={100}
            defaultValue={100}
            style={{ width: '100%' }}
            placeholder="组件宽度的百分比"
            addonAfter="%"
          />
        </Form.Item>

        {/* 文本域高度配置 */}
        {selectedField.type === 'textarea' && (
          <Form.Item label="高度" name="height">
            <InputNumber
              min={1}
              max={10}
              style={{ width: '100%' }}
              placeholder="行数"
            />
          </Form.Item>
        )}

        {/* 校验规则配置 */}
        <Divider orientation="left">校验规则</Divider>
        
        {/* 必填校验，默认选中且禁用 */}
        <Form.Item label="必填" name={['validation', 'required']} valuePropName="checked" initialValue={true}>
          <Switch checked={true} disabled />
        </Form.Item>
        
        {/* 常用校验选择 */}
        <Form.Item label="常用校验">
          <Select
            allowClear
            placeholder="请选择常用校验"
            value={selectedField?.validation?.custom || ''}
            onChange={val => {
              const selected = COMMON_VALIDATIONS.find(item => item.value === val);
              if (selectedField && selected) {
                if (selected.value) {
                  // 选择常用校验，自动填充 pattern、message、custom
                  onFieldUpdate(selectedField.id, {
                    validation: {
                      ...selectedField.validation,
                      custom: selected.value,
                      pattern: selected.pattern,
                      min: undefined,
                      max: undefined,
                      message: selected.message,
                    },
                  });
                  form.setFieldsValue({
                    validation: {
                      ...selectedField.validation,
                      custom: selected.value,
                      pattern: selected.pattern,
                      min: undefined,
                      max: undefined,
                      message: selected.message,
                    },
                  });
                } else {
                  // 选择"无"，清除 pattern/custom
                  onFieldUpdate(selectedField.id, {
                    validation: {
                      ...selectedField.validation,
                      custom: undefined,
                      pattern: undefined,
                      min: undefined,
                      max: undefined,
                    },
                  });
                  form.setFieldsValue({
                    validation: {
                      ...selectedField.validation,
                      custom: undefined,
                      pattern: undefined,
                      min: undefined,
                      max: undefined,
                    },
                  });
                }
              }
            }}
            options={COMMON_VALIDATIONS}
          />
        </Form.Item>
        
        {/* 字符长度配置（仅在未选择常用校验时显示） */}
        {(!selectedField?.validation?.custom) && (
          <>
            <Form.Item label="最小字符长度" name={['validation', 'min']}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="可输入的最少字符数" />
            </Form.Item>
            <Form.Item label="最大字符长度" name={['validation', 'max']}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="可输入的最多字符数" />
            </Form.Item>
          </>
        )}
        
        {/* 错误提示配置（始终可自定义） */}
        <Form.Item label="错误提示" name={['validation', 'message']}>
          <Input placeholder="自定义错误提示" />
        </Form.Item>
        
        {/* 校验触发时机配置 */}
        <Form.Item label="校验触发时机" name={['validation', 'trigger']} initialValue="onBlur">
          <Select
            options={[
              { label: '失焦时校验', value: 'onBlur' },
              { label: '输入时校验', value: 'onChange' },
            ]}
          />
        </Form.Item>

        {/* 选项配置（仅对选择类组件显示） */}
        {(selectedField.type === 'radio' || selectedField.type === 'checkbox' || selectedField.type === 'select' || selectedField.type === 'cascader' ) && (
          <>
            <Divider orientation="left">选项配置</Divider>
            <Form.Item label="选项来源">
              <Select
                value={optionSource}
                onChange={handleOptionSourceChange}
                placeholder="选择选项来源"
                options={[
                  { label: '自定义选项', value: 'custom' },
                  { label: '预设选项', value: 'preset' },
                ]}
              />
            </Form.Item>
            {optionSource === 'preset' && (
              <Form.Item label="预设类型">
                <Select
                  value={presetType}
                  onChange={handlePresetTypeChange}
                  placeholder="请选择预设类型"
                  options={PRESET_OPTIONS_LABELS}
                  allowClear
                />
              </Form.Item>
            )}
          </>
        )}

        {/* 评分配置（仅对评分组件显示） */}
        {selectedField.type === 'rating' && (
          <>
            <Divider orientation="left">评分配置</Divider>
            <Form.Item label="最大分值" name={['ratingConfig', 'max']}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="允许半星" name={['ratingConfig', 'allowHalf']} valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        )}

        {/* 上传配置（仅对上传组件显示） */}
        {selectedField.type === 'upload' && (
          <>
            <Divider orientation="left">上传配置</Divider>
            <Form.Item label="接受文件类型" name={['uploadConfig', 'accept']}>
              <Input placeholder="如: image/*" />
            </Form.Item>
            <Form.Item label="最大文件大小(MB)" name={['uploadConfig', 'maxSize']}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="最大上传数量" name={['uploadConfig', 'maxCount']}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}

        {/* 禁用状态配置 */}
        <Form.Item label="禁用" name="disabled" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PropertyPanel; 