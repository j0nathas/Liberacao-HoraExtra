import { useLocation, Navigate } from 'react-router-dom';
import { pdf, PDFViewer } from "@react-pdf/renderer";
import DocumentPDF from './DocumentPDF.jsx'
import toast from 'react-hot-toast';


export default function DocumentView() {
    const location = useLocation();

    const formsData = location.state?.forms;

    if (!formsData) {
        toast.error("Nenhum formulário enviado");
        return <Navigate to="/form" replace />;
    }

    return (
        <PDFViewer width="100%" height="800" style={{ border: 'none' }}>
            <DocumentPDF dadosConsolidados={formsData} />
        </PDFViewer>
    );
}