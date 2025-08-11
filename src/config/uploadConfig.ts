/**
 * 文件上传配置
 * 定义不同文件类型的上传接口、格式限制和大小限制
 */

export interface UploadApiConfig {
  url: string;
  method: 'POST' | 'PUT';
  headers?: Record<string, string>;
  timeout?: number;
}

export interface FileTypeConfig {
  accept: string;
  maxSize: number; // MB
  maxCount: number;
  api: UploadApiConfig;
  allowedExtensions: string[];
}

/**
 * 文件类型配置映射
 */
export const FILE_TYPE_CONFIGS: Record<string, FileTypeConfig> = {
  image: {
    accept: 'image/png,image/jpeg,image/jpg',
    maxSize: 5, // 5MB，更合理的图片大小限制
    maxCount: 5,
    api: {
      url: '/api/upload/image',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30秒
    },
    allowedExtensions: ['.png', '.jpeg', '.jpg'],
  },
  document: {
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    maxSize: 20, // 20MB，更合理的文档大小限制
    maxCount: 3,
    api: {
      url: '/api/upload/document',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60秒
    },
    allowedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  },
};

/**
 * 获取文件类型配置
 */
export const getFileTypeConfig = (fileType: string): FileTypeConfig => {
  return FILE_TYPE_CONFIGS[fileType] || FILE_TYPE_CONFIGS.image;
};

/**
 * 验证文件类型和大小
 */
export const validateFile = (file: File, fileType: string): { valid: boolean; message?: string } => {
  const config = getFileTypeConfig(fileType);
  
  // 检查文件大小
  if (file.size > config.maxSize * 1024 * 1024) {
    return {
      valid: false,
      message: `文件大小不能超过 ${config.maxSize}MB`
    };
  }
  
  // 检查文件扩展名
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!config.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      message: `不支持的文件格式，请上传 ${config.allowedExtensions.join('、')} 格式的文件`
    };
  }
  
  return { valid: true };
};

/**
 * 模拟上传接口
 * 实际项目中替换为真实的上传接口
 */
export const mockUploadFile = async (
  file: File, 
  fileType: string,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url?: string; message?: string }> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // 模拟上传成功
        const mockUrl = `https://mock-upload.com/${fileType}/${Date.now()}_${file.name}`;
        resolve({
          success: true,
          url: mockUrl,
          message: '上传成功'
        });
      }
      
      if (onProgress) {
        onProgress(Math.min(progress, 100));
      }
    }, 200);
  });
}; 