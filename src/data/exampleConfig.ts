import type { FormConfig } from '../types/form';
import { educationOptions, genderOptions } from './options';

export const exampleFormConfig: FormConfig = {
  title: '用户信息表单',
  description: '请填写您的个人信息',
  layout: 'vertical',
  responsive: true,
  fields: [
    {
      type: 'name',
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
      validation: {
        required: true,
        custom: 'chinese_name',
        message: '请输入2-4位中文姓名',
      },
      width: 300,
    },
    {
      type: 'age',
      name: 'age',
      label: '年龄',
      placeholder: '请输入年龄',
      validation: {
        required: true,
        custom: 'age',
        message: '请输入有效年龄（0-150）',
      },
      width: 300,
    },
    {
      type: 'radio',
      name: 'gender',
      label: '性别',
      options: genderOptions,
      validation: {
        required: true,
      },
    },
    {
      type: 'radio',
      name: 'education',
      label: '学历',
      options: educationOptions,
      validation: {
        required: true,
      },
    },
    {
      type: 'idcard',
      name: 'idcard',
      label: '身份证号',
      placeholder: '请输入身份证号',
      validation: {
        required: true,
        custom: 'idcard',
        message: '请输入正确的身份证号',
      },
      width: 300,
    },
    {
      type: 'phone',
      name: 'phone',
      label: '手机号',
      placeholder: '请输入手机号',
      validation: {
        required: true,
        custom: 'phone',
        message: '请输入正确的手机号',
      },
      width: 300,
    },
    {
      type: 'input',
      name: 'email',
      label: '邮箱',
      placeholder: '请输入邮箱',
      validation: {
        required: true,
        custom: 'email',
        message: '请输入正确的邮箱格式',
      },
      width: 300,
    },
    {
      type: 'province',
      name: 'province',
      label: '所在省份',
      validation: {
        required: true,
      },
      width: 300,
    },
    {
      type: 'ethnicity',
      name: 'ethnicity',
      label: '民族',
      validation: {
        required: true,
      },
      width: 300,
    },
    {
      type: 'political',
      name: 'political',
      label: '政治面貌',
      validation: {
        required: true,
      },
      width: 300,
    },
    {
      type: 'wechat',
      name: 'wechat',
      label: '微信号',
      placeholder: '请输入微信号',
      width: 300,
    },
    {
      type: 'company',
      name: 'company',
      label: '公司',
      placeholder: '请输入公司名称',
      width: 300,
    },
    {
      type: 'position',
      name: 'position',
      label: '职位',
      placeholder: '请输入职位',
      width: 300,
    },
    {
      type: 'textarea',
      name: 'address',
      label: '详细地址',
      placeholder: '请输入详细地址',
      validation: {
        required: true,
        min: 5,
        max: 200,
      },
      width: 400,
      height: 3,
    },
    {
      type: 'date',
      name: 'birthday',
      label: '出生日期',
      validation: {
        required: true,
      },
      width: 300,
    },
    {
      type: 'time',
      name: 'workTime',
      label: '工作时间',
      width: 300,
    },
    {
      type: 'rating',
      name: 'satisfaction',
      label: '满意度评分',
      ratingConfig: {
        max: 5,
        allowHalf: true,
      },
    },
    {
      type: 'upload',
      name: 'avatar',
      label: '头像上传',
      uploadConfig: {
        accept: 'image/*',
        maxSize: 3 * 1024 * 1024, // 3MB
        maxCount: 1,
      },
    },
    {
      type: 'checkbox',
      name: 'interests',
      label: '兴趣爱好',
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' },
        { label: '烹饪', value: 'cooking' },
      ],
    },
  ],
}; 