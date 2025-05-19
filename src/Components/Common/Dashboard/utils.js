export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateTrendData = (classifierData) => {
  const types = [...new Set(classifierData.map(item => item.type))];
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const dataPoint = {
      date: dateStr,
    };
    
    types.forEach(type => {
      const baseCount = classifierData.find(item => item.type === type)?.total || 0;
      const variation = Math.random() * 0.3 + 0.85; // Random between 85% and 115%
      dataPoint[type] = Math.round(baseCount / 7 * variation);
    });
    
    return dataPoint;
  });
}; 