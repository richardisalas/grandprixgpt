/**
 * Formats text with named items in ** markers into a structured format
 * @param text Raw text with names wrapped in ** markers
 * @returns Formatted HTML string with structured content
 */
export const formatStructuredText = (text: string): string => {
  // First handle structure items like lists
  let formatted = text
    // Add line breaks before numbered points
    .replace(/(\d+\.\s+)/g, '<br>$1')
    // Handle dash lists with descriptions: - **Name**: Description.
    .replace(/-\s+\*\*([^*]+)\*\*:([^-\n]*)/g, 
      '<div class="entry"><h3>$1</h3><p>$2</p></div>')
    // Handle dash lists without colons: - **Name** Description.
    .replace(/-\s+\*\*([^*]+)\*\*\s([^-\n]*)/g, 
      '<div class="entry"><h3>$1</h3><p>$2</p></div>');
    
  // Then handle any remaining **Text** patterns for inline emphasis
  formatted = formatted
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
  // Remove the first <br> if it appears at the very beginning
  formatted = formatted.replace(/^<br>/, '');
    
  return formatted.trim();
};

/**
 * Formats text with named items in ** markers into clean plain text
 * @param text Raw text with names wrapped in ** markers
 * @returns Formatted plain text with clear structure
 */
export const formatPlainText = (text: string): string => {
  // First handle structure items
  let formatted = text
    // Handle dash lists with descriptions: - **Name**: Description.
    .replace(/-\s+\*\*([^*]+)\*\*:([^-\n]*)/g, '\n$1:\n$2\n')
    // Handle dash lists without colons: - **Name** Description.
    .replace(/-\s+\*\*([^*]+)\*\*\s([^-\n]*)/g, '\n$1:\n$2\n');
  
  // Then handle any remaining **Text** markers
  formatted = formatted
    .replace(/\*\*([^*]+)\*\*/g, '$1');
  
  return formatted.trim();
}; 