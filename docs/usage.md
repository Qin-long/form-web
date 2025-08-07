# 动态表单生成器使用说明

## 概述

动态表单生成器是一个基于 React + TypeScript + Ant Design 的前端项目，支持通过 JSON 配置动态生成各种类型的表单，并支持自定义校验规则。

## 功能特性

### 支持的组件类型

#### 基础组件
- **输入框 (input)**: 单行文本输入
- **多行输入框 (textarea)**: 多行文本输入
- **单选框 (radio)**: 单选选项
- **多选框 (checkbox)**: 多选选项
- **下拉选择 (select)**: 下拉菜单选择
- **日期选择 (date)**: 日期选择器
- **时间选择 (time)**: 时间选择器
- **评分 (rating)**: 星级评分
- **图片上传 (upload)**: 文件上传

#### 常用组件
- **身份证 (idcard)**: 身份证号输入和校验
- **手机号 (phone)**: 手机号输入和校验
- **省份选择 (province)**: 省份下拉选择
- **姓名 (name)**: 中文姓名输入
- **年龄 (age)**: 年龄输入和校验
- **民族 (ethnicity)**: 民族选择
- **政治面貌 (political)**: 政治面貌选择
- **微信号 (wechat)**: 微信号输入
- **公司 (company)**: 公司名称输入
- **职位 (position)**: 职位输入

### 校验规则支持

#### 基础校验
- **必填校验**: `required: true`
- **长度校验**: `min: number`, `max: number`
- **正则校验**: `pattern: string`

#### 自定义校验
- **身份证号**: `custom: 'idcard'`
- **手机号**: `custom: 'phone'`
- **邮箱**: `custom: 'email'`
- **中文姓名**: `custom: 'chinese_name'`
- **整数**: `custom: 'integer'`
- **年龄**: `custom: 'age'`

## 使用方法

### 1. 基本使用

```typescript
import DynamicForm from './components/DynamicForm';
import type { FormConfig } from './types/form';

const formConfig: FormConfig = {
  title: '用户信息表单',
  fields: [
    {
      type: 'name',
      name: 'name',
      label: '姓名',
      validation: {
        required: true,
        custom: 'chinese_name',
      },
    },
    {
      type: 'phone',
      name: 'phone',
      label: '手机号',
      validation: {
        required: true,
        custom: 'phone',
      },
    },
  ],
};

function App() {
  const handleSubmit = (data: any) => {
    console.log('表单数据:', data);
  };

  return (
    <DynamicForm
      config={formConfig}
      onSubmit={handleSubmit}
    />
  );
}
```

### 2. 使用表单构建器

```typescript
import { FormBuilder } from './utils/formBuilder';

// 创建用户信息表单
const userInfoForm = FormBuilder.createUserInfoForm();

// 创建自定义表单
const customForm = new FormBuilder('自定义表单')
  .addField('name')
  .addField('phone')
  .addField('email')
  .addCustomField({
    type: 'textarea',
    name: 'message',
    label: '留言',
    validation: { required: true },
  })
  .build();
```

### 3. 表单配置结构

```typescript
interface FormConfig {
  title?: string;           // 表单标题
  description?: string;     // 表单描述
  fields: FormField[];      // 字段配置数组
  layout?: 'horizontal' | 'vertical';  // 布局方式
  responsive?: boolean;     // 是否响应式
}

interface FormField {
  type: FieldType;          // 字段类型
  name: string;             // 字段名称
  label: string;            // 字段标签
  placeholder?: string;     // 占位符
  defaultValue?: any;       // 默认值
  options?: Option[];       // 选项（用于选择类组件）
  validation?: ValidationRule;  // 校验规则
  width?: number;           // 宽度
  height?: number;          // 高度
  disabled?: boolean;       // 是否禁用
  hidden?: boolean;         // 是否隐藏
}
```

### 4. 校验规则配置

```typescript
interface ValidationRule {
  required?: boolean;       // 是否必填
  min?: number;            // 最小长度/数量
  max?: number;            // 最大长度/数量
  pattern?: string;        // 正则表达式
  custom?: string;         // 自定义校验规则名称
  message?: string;        // 错误提示信息
}
```

## 扩展自定义组件

### 1. 添加新的字段类型

在 `src/types/form.ts` 中添加新的字段类型：

```typescript
export type FieldType = 
  | 'existing_types'
  | 'your_new_type';
```

### 2. 在 FormField 组件中添加渲染逻辑

在 `src/components/FormField.tsx` 中添加新的 case：

```typescript
case 'your_new_type':
  return <YourCustomComponent {...commonProps} />;
```

### 3. 添加自定义校验规则

在 `src/utils/validation.ts` 中添加校验函数：

```typescript
export const validateYourCustom = (value: string): boolean => {
  // 你的校验逻辑
  return true;
};

export const customValidators: Record<string, (value: any) => boolean> = {
  // ... existing validators
  your_custom: validateYourCustom,
};
```

## 响应式设计

表单支持响应式设计，在不同设备上自动适配：

- **PC 端**: 标准布局，组件宽度较大
- **移动端**: 紧凑布局，组件宽度自适应

## 主题定制

可以通过修改 CSS 变量或 Ant Design 的主题配置来自定义样式：

```css
/* 自定义主题色 */
:root {
  --primary-color: #1890ff;
  --border-radius: 6px;
}
```

## 最佳实践

1. **字段命名**: 使用有意义的字段名称，避免使用特殊字符
2. **校验规则**: 合理设置校验规则，提供清晰的错误提示
3. **用户体验**: 为必填字段添加明显的标识
4. **性能优化**: 对于大型表单，考虑分步加载或虚拟滚动
5. **可访问性**: 确保表单具有良好的可访问性支持

## 常见问题

### Q: 如何添加新的校验规则？
A: 在 `src/utils/validation.ts` 中添加校验函数，并在 `customValidators` 中注册。

### Q: 如何自定义组件样式？
A: 可以通过 CSS 类名或内联样式来自定义组件外观。

### Q: 如何支持文件上传？
A: 使用 `upload` 类型字段，配置 `uploadConfig` 参数。

### Q: 如何实现表单联动？
A: 可以通过监听字段值变化来实现表单联动逻辑。 