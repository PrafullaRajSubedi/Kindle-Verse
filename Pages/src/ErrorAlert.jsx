import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6 overflow-hidden">
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}