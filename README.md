# 拖拽式表单设计器

一个基于 React + TypeScript + Ant Design 的拖拽式表单设计器，支持动态生成表单、自定义校验规则、表单发布和填写。

## 功能特性

### 🎨 表单设计
- **拖拽式设计**：从组件库拖拽组件到设计画布
- **实时预览**：设计过程中实时预览表单效果
- **属性配置**：详细的组件属性配置面板
- **栅格布局**：支持24列栅格布局，组件可自由调整宽度
- **组件排序**：支持拖拽排序和上下移动

### 📝 表单组件
- **基础组件**：输入框、文本域、单选框、复选框、下拉选择
- **高级组件**：日期选择、时间选择、评分、文件上传
- **预设组件**：身份证、手机号、省份、姓名、年龄、民族、政治面貌、微信、公司、职位
- **级联选择**：省市区三级联动选择

### ✅ 校验规则
- **必填校验**：支持必填项设置
- **长度校验**：最小/最大字符长度限制
- **正则校验**：自定义正则表达式校验
- **常用校验**：手机号、邮箱、身份证等常用格式校验
- **触发方式**：支持 onBlur、onChange、onInput 触发校验

### 📤 表单发布
- **表单发布**：将设计好的表单发布供他人填写
- **分享链接**：生成可分享的表单链接
- **访问统计**：记录表单访问和提交次数
- **配置管理**：保存和管理表单配置

### 📋 表单填写
- **独立页面**：完全独立的表单填写页面，无其他UI干扰
- **响应式设计**：支持PC和移动端自适应
- **数据保存**：自动保存填写的数据到本地存储
- **预览功能**：支持预览已提交的表单数据

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 使用指南

### 1. 设计表单
1. 访问首页 `/` 进入表单设计器
2. 从左侧组件库拖拽组件到设计画布
3. 在右侧属性面板配置组件属性
4. 切换到"预览"标签页查看效果

### 2. 发布表单
1. 在设计器中点击"发布"按钮
2. 输入发布名称
3. 发布成功后跳转到发布管理页面

### 3. 填写表单
#### 方式一：直接访问
- 在发布管理页面点击"填写表单"按钮
- 或直接访问表单链接：`/form/{formId}`

#### 方式二：嵌入其他项目
- 使用嵌入模式：`/form/{formId}?embedded=true`
- 仅显示表单内容，无其他UI元素

### 4. 预览提交数据
1. 访问"已填写表单"页面 `/submissions`
2. 点击"预览"按钮查看提交的数据
3. 或直接访问：`/form/{formId}?preview=true&submission={submissionId}`

### 5. 编辑表单
#### 在设计器中编辑
1. 在发布管理页面点击"编辑配置"
2. 修改表单设计
3. 保存更新

#### 在填写页面编辑
1. 在表单填写页面点击"编辑表单"按钮
2. 在弹出的设计器中修改
3. 选择"保存"或"保存为新配置"

## 页面路由

- `/` - 表单设计器主页
- `/publish` - 表单发布管理页面
- `/form/:formId` - 表单填写页面
- `/submissions` - 已填写表单列表

## URL 参数

### 表单填写页面参数
- `embedded=true` - 嵌入模式，仅显示表单内容
- `preview=true` - 预览模式，只读显示
- `submission={id}` - 预览指定的提交数据

### 示例URL
```
# 正常填写表单
/form/published_1705123456789_def456

# 嵌入模式
/form/published_1705123456789_def456?embedded=true

# 预览提交数据
/form/published_1705123456789_def456?preview=true&submission=submission_1705123456789_abc123
```

## 技术栈

- **前端框架**：React 18 + TypeScript
- **UI 组件库**：Ant Design 5.x
- **构建工具**：Vite
- **路由管理**：React Router 6
- **状态管理**：React Hooks
- **数据存储**：LocalStorage
- **样式方案**：CSS-in-JS + Ant Design 主题

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── ComponentPanel.tsx    # 组件库面板
│   ├── DesignCanvas.tsx      # 设计画布
│   ├── PropertyPanel.tsx     # 属性配置面板
│   ├── DynamicForm.tsx       # 动态表单组件
│   ├── FormField.tsx         # 表单字段组件
│   ├── FormDesigner.tsx      # 表单设计器主组件
│   ├── FormPublisher.tsx     # 表单发布管理
│   ├── FormFiller.tsx        # 表单填写页面
│   └── SubmissionList.tsx    # 提交数据列表
├── types/               # 类型定义
│   ├── form.ts         # 表单相关类型
│   └── designer.ts     # 设计器相关类型
├── data/               # 静态数据
│   ├── options.ts      # 预设选项数据
│   ├── componentLibrary.ts  # 组件库配置
│   └── cascaderOptions.ts   # 省市区数据
├── utils/              # 工具函数
│   ├── validation.ts   # 校验工具
│   └── formBuilder.ts  # 表单构建工具
└── App.tsx             # 应用入口
```

## 开发说明

### 添加新组件
1. 在 `src/data/componentLibrary.ts` 中添加组件配置
2. 在 `src/components/FormField.tsx` 中添加组件渲染逻辑
3. 在 `src/types/form.ts` 中添加相关类型定义

### 自定义校验规则
1. 在 `src/utils/validation.ts` 中添加校验函数
2. 在 `src/components/DynamicForm.tsx` 的 `getAntdRules` 函数中添加规则

### 数据存储
- `formConfigs` - 保存的表单配置
- `publishedForms` - 已发布的表单
- `formSubmissions` - 提交的表单数据

## 许可证

MIT License 