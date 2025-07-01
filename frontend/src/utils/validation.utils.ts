export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Validación para teléfonos: permite espacios, paréntesis, guiones, y símbolo +
  // Mínimo 7 y máximo 15 caracteres
  const phoneRegex = /^[\+]?[\d\s\(\)\-]{7,15}$/;
  return phoneRegex.test(phone.trim());
};

export const validateAddress = (address: string): boolean => {
  // Máximo 255 caracteres, permite letras, números, espacios y signos: . , - # /
  if (address.length === 0 || address.length > 255) return false;
  const addressRegex = /^[a-zA-Z0-9\s\.,\-#\/]+$/;
  return addressRegex.test(address);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES');
};

export const formatDateForInput = (date: string | Date): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

export const validateDateRange = (startDate: string | Date, endDate: string | Date): boolean => {
  if (!startDate || !endDate) return true; // Si alguna fecha está vacía, no validamos
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return end >= start;
};

export const getDateRangeErrorMessage = (): string => {
  return 'La fecha de finalización no puede ser anterior a la fecha de inicio';
}; 