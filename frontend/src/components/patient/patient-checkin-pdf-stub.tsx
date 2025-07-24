import React from 'react';
import JsonViewer from '../patient/JsonViewer'; // Adjust the import path as necessary



interface PdfStubProps {
    jsonData: object;
}

const PatientCheckinPdfStub: React.FC<PdfStubProps> = ({ jsonData }) => {
    const sampleJson = {
        name: "John Doe",
        age: 30,
        symptoms: ["headache", "nausea"],
    };

    return (
        <div className="text-neutral-400">
            <h1>Patient Check-in PDF Stub</h1>
            <JsonViewer jsonData={jsonData} />
        </div>
    );
};

export default PatientCheckinPdfStub;
