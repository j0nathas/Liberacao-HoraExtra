import React from 'react';
import { pdf } from '@react-pdf/renderer';
import DocumentPDF from '../DocumentPDF.jsx'

export async function gerarPDFBase64(dados) {
    const dadosConsolidados = dados;
    const blob = await pdf(
        React.createElement(DocumentPDF, { dadosConsolidados })
    ).toBlob();

    // Converte para Base64
    const base64 = await blobToBase64(blob);

    return base64;
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}