import type { ComponentItem } from '../types/designer';

export const componentLibrary: ComponentItem[] = [
  // 基础组件
  {
    id: 'input',
    type: 'input',
    name: '输入框',
    icon: '📝',
    category: 'basic',
    defaultConfig: {
      type: 'input',
      name: 'input',
      label: '输入框',
      placeholder: '请输入',
      span: 24,
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
        min: 1,
        max: 10,
      },
    },
  },
  {
    id: 'textarea',
    type: 'textarea',
    name: '多行输入框',
    icon: '📄',
    category: 'basic',
    defaultConfig: {
      type: 'textarea',
      name: 'textarea',
      label: '多行输入框',
      placeholder: '请输入',
      height: 4,
      inputConfig: {
        widthPercent: 100,
      },
      span: 24,
      validation: {
        required: true,
        min: 1,
        max: 300,
      },
    },
  },
  {
    id: 'radio',
    type: 'radio',
    name: '单选框',
    icon: '🔘',
    category: 'basic',
    defaultConfig: {
      type: 'radio',
      name: 'radio',
      label: '单选框',
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
      ],
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  {
    id: 'checkbox',
    type: 'checkbox',
    name: '多选框',
    icon: '☑️',
    category: 'basic',
    defaultConfig: {
      type: 'checkbox',
      name: 'checkbox',
      label: '多选框',
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
      ],
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  {
    id: 'select',
    type: 'select',
    name: '下拉选择',
    icon: '📋',
    category: 'basic',
    defaultConfig: {
      type: 'select',
      name: 'select',
      label: '下拉选择',
      placeholder: '请选择',
      span: 24,
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
      ],
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  {
    id: 'cascader',
    type: 'cascader',
    name: '级联选择',
    icon: '🏢',
    category: 'basic',
    defaultConfig: {
      type: 'cascader',
      name: 'cascader',
      span: 24,
      label: '级联选择',
      placeholder: '请选择',
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  {
    id: 'date',
    type: 'date',
    name: '日期选择',
    icon: '📅',
    category: 'basic',
    defaultConfig: {
      type: 'date',
      name: 'date',
      label: '日期选择',
      span: 24,
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  {
    id: 'time',
    type: 'time',
    name: '时间选择',
    icon: '⏰',
    category: 'basic',
    defaultConfig: {
      type: 'time',
      name: 'time',
      label: '时间选择',
      span: 24,
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  {
    id: 'rating',
    type: 'rating',
    name: '评分',
    icon: '⭐',
    category: 'basic',
    defaultConfig: {
      type: 'rating',
      name: 'rating',
      label: '评分',
      span: 24,
      ratingConfig: {
        max: 5,
        allowHalf: true,
      },
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  {
    id: 'upload',
    type: 'upload',
    name: '文件上传',
    icon: '📁',
    category: 'basic',
    defaultConfig: {
      type: 'upload',
      name: 'upload',
      label: '文件上传',
      span: 24,
      uploadConfig: {
        accept: 'image/png,image/jpeg,image/jpg',
        maxSize: 5, // 默认5MB，更合理的限制
        maxCount: 1,
        fileType: 'image', // 新增：文件类型预设
      },
      inputConfig: {
        widthPercent: 100,
      },
      validation: {
        required: true,
      },
    },
  },
  // 高级组件
  {
    id: 'input',
    type: 'input',
    name: '姓名',
    icon: '👤',
    category: 'advanced',
    defaultConfig: {
      type: 'input',
      name: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      span: 24,
      validation: {
        required: true,
        custom: 'chinese_name',
        pattern: '^[一-龥]{2,4}$',
        message: '请输入2-4位中文姓名'
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'input',
    type: 'input',
    name: '手机号',
    icon: '📱',
    category: 'advanced',
    defaultConfig: {
      type: 'input',
      name: 'input',
      label: '手机号',
      placeholder: '请输入手机号',
      span: 24,
      validation: {
        required: true,
        custom: 'phone',
        pattern: '^1[3-9]\\d{9}$',
        message: '请输入正确的手机号',
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'input',
    type: 'input',
    name: '身份证',
    icon: '🆔',
    category: 'advanced',
    defaultConfig: {
      type: 'input',
      name: 'input',
      label: '身份证号',
      placeholder: '请输入身份证号',
      span: 24,
      validation: {
        required: true,
        pattern: '^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$',
        custom: 'idcard',
        message: '请输入正确的身份证号',
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'input',
    type: 'input',
    name: '邮箱',
    icon: '📧',
    category: 'advanced',
    defaultConfig: {
      type: 'input',
      name: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      span: 24,
      validation: {
        required: true,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        custom: 'email',
        message: '请输入正确的邮箱格式',
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'input',
    type: 'input',
    name: '年龄',
    icon: '🎂',
    category: 'advanced',
    defaultConfig: {
      type: 'input',
      name: 'input',
      label: '年龄',
      placeholder: '请输入年龄',
      span: 24,
      validation: {
        required: true,
        pattern: '^[0-9]{1,3}$',
        custom: 'age',
        message: '请输入有效年龄（0-150）',
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'province',
    type: 'province',
    name: '省份',
    icon: '🗺️',
    category: 'advanced',
    defaultConfig: {
      type: 'province',
      name: 'province',
      label: '所在省份',
      span: 24,
      validation: {
        required: true,
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'ethnicity',
    type: 'ethnicity',
    name: '民族',
    icon: '👥',
    category: 'advanced',
    defaultConfig: {
      type: 'ethnicity',
      name: 'ethnicity',
      label: '民族',
      span: 24,
      validation: {
        required: true,
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'political',
    type: 'political',
    name: '政治面貌',
    icon: '🏛️',
    category: 'advanced',
    defaultConfig: {
      type: 'political',
      name: 'political',
      label: '政治面貌',
      span: 24,
      validation: {
        required: true,
      },
      inputConfig: {
        widthPercent: 100,
      },
    },
  },
  {
    id: 'cascader-address',
    type: 'cascader',
    name: '地址',
    icon: '🏢',
    category: 'advanced',
    defaultConfig: {
      label: '地址',
      type: 'cascader',
      name: 'cascader',
      placeholder: '请选择地址',
      span: 24,
      validation: {
        required: true,
      },
      inputConfig: {
        widthPercent: 100,
      },
      optionsPreset: 'cascader', // 添加地址预设
    },
  },
];

// 按分类获取组件
export const getComponentsByCategory = (category: 'basic' | 'advanced' | 'custom') => {
  return componentLibrary.filter(component => component.category === category);
};

// 根据ID获取组件
export const getComponentById = (id: string) => {
  return componentLibrary.find(component => component.id === id);
}; 