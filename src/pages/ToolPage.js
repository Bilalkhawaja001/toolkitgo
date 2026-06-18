import React, { Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Wrench } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import ComingSoonTool from '../components/ComingSoonTool';
import LoadingSpinner from '../components/LoadingSpinner';
import { getToolById, tools } from '../data/toolsData';

const lazyTool = (loader) => lazy(loader);

const PdfSuiteRoute = (toolId) => lazy(() =>
  import('../tools/pdf-suite/PdfSuiteTool').then((module) => ({
    default: () => <module.default toolId={toolId} />
  }))
);

const ImageTransformRoute = (toolId) => lazy(() =>
  import('../tools/image-tools/ImageTransformTool').then((module) => ({
    default: () => <module.default toolId={toolId} />
  }))
);

const pdfSuiteToolIds = tools
  .filter((tool) => tool.category === 'pdf-tools' && tool.id !== 'pdf-to-image')
  .map((tool) => tool.id);

const imageTransformToolIds = ['image-crop', 'image-rotate-flip', 'image-watermark', 'image-blur-pixelate', 'color-picker'];

const pdfSuiteComponents = pdfSuiteToolIds.reduce((components, id) => {
  components[id] = PdfSuiteRoute(id);
  return components;
}, {});

const imageTransformComponents = imageTransformToolIds.reduce((components, id) => {
  components[id] = ImageTransformRoute(id);
  return components;
}, {});

const readyToolComponents = {
  'word-counter': lazyTool(() => import('../tools/text-tools/WordCounter')),
  'character-counter': lazyTool(() => import('../tools/text-tools/CharacterCounter')),
  'case-converter': lazyTool(() => import('../tools/text-tools/CaseConverter')),
  'remove-extra-spaces': lazyTool(() => import('../tools/text-tools/RemoveExtraSpaces')),
  'text-to-slug': lazyTool(() => import('../tools/text-tools/TextToSlug')),
  'duplicate-line-remover': lazyTool(() => import('../tools/text-tools/DuplicateLineRemover')),
  'text-sorter': lazyTool(() => import('../tools/text-tools/TextSorter')),
  'find-and-replace': lazyTool(() => import('../tools/text-tools/FindAndReplace')),
  'emi-calculator': lazyTool(() => import('../tools/calculator-tools/EmiCalculator')),
  'gst-calculator': lazyTool(() => import('../tools/calculator-tools/GstCalculator')),
  'bmi-calculator': lazyTool(() => import('../tools/calculator-tools/BmiCalculator')),
  'age-calculator': lazyTool(() => import('../tools/calculator-tools/AgeCalculator')),
  'percentage-calculator': lazyTool(() => import('../tools/calculator-tools/PercentageCalculator')),
  'unit-converter': lazyTool(() => import('../tools/calculator-tools/UnitConverter')),
  'date-calculator': lazyTool(() => import('../tools/calculator-tools/DateCalculator')),
  'json-formatter': lazyTool(() => import('../tools/developer-tools/JsonFormatter')),
  'base64-encoder': lazyTool(() => import('../tools/developer-tools/Base64Encoder')),
  'url-encoder': lazyTool(() => import('../tools/developer-tools/UrlEncoder')),
  'html-encoder': lazyTool(() => import('../tools/developer-tools/HtmlEncoder')),
  'css-minifier': lazyTool(() => import('../tools/developer-tools/CssMinifier')),
  'js-minifier': lazyTool(() => import('../tools/developer-tools/JsMinifier')),
  'password-generator': lazyTool(() => import('../tools/developer-tools/PasswordGenerator')),
  'lorem-ipsum': lazyTool(() => import('../tools/developer-tools/LoremIpsum')),
  'wifi-qr-generator': lazyTool(() => import('../tools/qr-tools/WifiQrGenerator')),
  'whatsapp-qr-generator': lazyTool(() => import('../tools/qr-tools/WhatsAppQrGenerator')),
  'barcode-generator': lazyTool(() => import('../tools/qr-tools/BarcodeGenerator')),
  'vcard-qr-generator': lazyTool(() => import('../tools/qr-tools/VCardQrGenerator')),
  'qr-code-generator': lazyTool(() => import('../tools/qr-tools/QRCodeGenerator')),
  'invoice-generator': lazyTool(() => import('../tools/business-tools/InvoiceGenerator')),
  'receipt-generator': lazyTool(() => import('../tools/business-tools/ReceiptGenerator')),
  'quotation-generator': lazyTool(() => import('../tools/business-tools/QuotationGenerator')),
  'salary-slip-generator': lazyTool(() => import('../tools/business-tools/SalarySlipGenerator')),
  'purchase-order-generator': lazyTool(() => import('../tools/business-tools/PurchaseOrderGenerator')),
  'image-resize': lazyTool(() => import('../tools/image-tools/ImageResize')),
  'image-compress': lazyTool(() => import('../tools/image-tools/ImageCompress')),
  'image-converter': lazyTool(() => import('../tools/image-tools/ImageConverter')),
  'image-to-pdf': lazyTool(() => import('../tools/image-tools/ImageToPdf')),
  'cnic-id-card-duplex-print': lazyTool(() => import('../tools/image-tools/CnicDuplexPrintTool')),
  'background-remover': lazyTool(() => import('../tools/image-tools/BackgroundRemover')),
  'image-enhancer': lazyTool(() => import('../tools/image-tools/ImageEnhancer')),
  'image-ocr': lazyTool(() => import('../tools/image-tools/ImageOcr')),
  'object-remover': lazyTool(() => import('../tools/image-tools/ObjectRemover')),
  'pdf-to-image': lazyTool(() => import('../tools/pdf-tools/PdfToImage')),
  ...imageTransformComponents,
  ...pdfSuiteComponents
};

function ToolNotFound() {
  return (
    <div className="empty-state">
      <Wrench size={48} />
      <h1>Tool Not Found</h1>
      <p>The tool route you opened is not registered in this demo skeleton.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}

function ToolPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  const ToolComponent = tool ? readyToolComponents[tool.id] : null;

  if (!tool) {
    return (
      <>
        <Helmet>
          <title>Tool Not Found - Free Online Tools</title>
          <meta name="description" content="The requested tool is not available in this demo." />
        </Helmet>
        <ToolNotFound />
      </>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{`${tool.name} - Free Online Tool`}</title>
        <meta name="description" content={tool.description} />
      </Helmet>
      <ToolLayout>
        {ToolComponent ? (
          <Suspense fallback={<LoadingSpinner message="Loading tool..." />}>
            <ToolComponent />
          </Suspense>
        ) : <ComingSoonTool tool={tool} />}
      </ToolLayout>
    </div>
  );
}

export default ToolPage;
