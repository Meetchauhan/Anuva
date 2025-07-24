import React from 'react';

interface JsonViewerProps {
    jsonData: object;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonData }) => {
    const formattedJson = JSON.stringify(jsonData, null, 2); // Pretty print JSON

    return (
        <div
            role="region"
            aria-label="JSON Viewer"
            style={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: 'cobalt',
                overflow: 'auto',
                maxHeight: '70vh', // Increased height
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
            }}
        >
            <style>
                {`
                    /* For WebKit browsers */
                    div::-webkit-scrollbar {
                        width: 12px;
                    }
                    div::-webkit-scrollbar-track {
                        background: #f1f1f1;
                    }
                    div::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 6px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                `}
            </style>
            {formattedJson}
        </div>
    );
};

export default JsonViewer;
