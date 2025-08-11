/**
 * 文件验证工具函数
 * 用于验证文件类型、大小等
 */

import { message } from 'antd';
import { getFileTypeConfig } from '../config/uploadConfig';

/**
 * 验证文件是否满足上传要求
 */
export const validateUploadFile = (
  file: File, 
  fileType: string,
  customMaxSize?: number,
  customMaxCount?: number
): { valid: boolean; message?: string } => {
  const config = getFileTypeConfig(fileType);
  
  // 使用自定义限制或默认限制
  const maxSize = customMaxSize || config.maxSize;
  const maxCount = customMaxCount || config.maxCount;
  
  // 检查文件大小
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSize) {
    return {
      valid: false,
      message: `文件大小不能超过 ${maxSize}MB，当前文件大小: ${fileSizeMB.toFixed(2)}MB`
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
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 获取文件类型图标
 */
export const getFileTypeIcon = (fileName: string): string => {
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  
  const iconMap: Record<string, string> = {
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.pdf': '📄',
    '.doc': '📝',
    '.docx': '📝',
    '.xls': '📊',
    '.xlsx': '📊',
  };
  
  return iconMap[extension] || '📁';
};

/**
 * 检查是否为图片文件
 */
export const isImageFile = (fileName: string): boolean => {
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'].includes(extension);
};

/**
 * 检查是否为文档文件
 */
export const isDocumentFile = (fileName: string): boolean => {
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'].includes(extension);
}; 