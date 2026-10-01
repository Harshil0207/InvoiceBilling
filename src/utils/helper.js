/**
 * Transforms standard numeric balances into highly localized financial string structures.
 * @param {number} value - Structural data value.
 * @returns {string} - Styled layout tracking metric pattern output.
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value || 0);
};

/**
 * Standardizes date sequence transformations.
 * @param {string} dateString - ISO text string format representation.
 * @returns {string} - Customized structural date visual segment output.
 */
export const formatSystemDate = (dateString) => {
  if (!dateString) return '---';
  const event = new Date(dateString);
  return event.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Unique identifier hash sequence generator logic utility layer.
 * @param {string} prefix - Descriptor string header tag text value.
 * @returns {string} - Complete runtime generated node block tracker identity.
 */
export const generateTrackingID = (prefix = 'ID') => {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};