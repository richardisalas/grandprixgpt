"use client"

import React, { useState } from 'react';
import { formatStructuredText, formatPlainText } from '../utils';

interface FormattedContentProps {
  rawText: string;
  useHtml?: boolean;
}

export default function FormattedContent({ 
  rawText, 
  useHtml = true 
}: FormattedContentProps) {
  const formattedContent = useHtml 
    ? formatStructuredText(rawText)
    : formatPlainText(rawText);
    
  return useHtml ? (
    <div 
      className="formatted-content" 
      dangerouslySetInnerHTML={{ __html: formattedContent }} 
    />
  ) : (
    <pre className="formatted-plain">{formattedContent}</pre>
  );
} 