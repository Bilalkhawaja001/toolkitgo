import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Wrench } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';
import ComingSoonTool from '../components/ComingSoonTool';
import { getToolById } from '../data/toolsData';

import WordCounter from '../tools/text-tools/WordCounter';
import CharacterCounter from '../tools/text-tools/CharacterCounter';
import CaseConverter from '../tools/text-tools/CaseConverter';
import RemoveExtraSpaces from '../tools/text-tools/RemoveExtraSpaces';
import TextToSlug from '../tools/text-tools/TextToSlug';
import DuplicateLineRemover from '../tools/text-tools/DuplicateLineRemover';
import TextSorter from '../tools/text-tools/TextSorter';
import FindAndReplace from '../tools/text-tools/FindAndReplace';
import EmiCalculator from '../tools/calculator-tools/EmiCalculator';
import GstCalculator from '../tools/calculator-tools/GstCalculator';
import BmiCalculator from '../tools/calculator-tools/BmiCalculator';
import AgeCalculator from '../tools/calculator-tools/AgeCalculator';
import PercentageCalculator from '../tools/calculator-tools/PercentageCalculator';
import UnitConverter from '../tools/calculator-tools/UnitConverter';
import DateCalculator from '../tools/calculator-tools/DateCalculator';
import JsonFormatter from '../tools/developer-tools/JsonFormatter';
import Base64Encoder from '../tools/developer-tools/Base64Encoder';
import UrlEncoder from '../tools/developer-tools/UrlEncoder';
import WifiQrGenerator from '../tools/qr-tools/WifiQrGenerator';
import WhatsAppQrGenerator from '../tools/qr-tools/WhatsAppQrGenerator';
import BarcodeGenerator from '../tools/qr-tools/BarcodeGenerator';
import VCardQrGenerator from '../tools/qr-tools/VCardQrGenerator';
import HtmlEncoder from '../tools/developer-tools/HtmlEncoder';
import CssMinifier from '../tools/developer-tools/CssMinifier';
import JsMinifier from '../tools/developer-tools/JsMinifier';
import PasswordGenerator from '../tools/developer-tools/PasswordGenerator';
import LoremIpsum from '../tools/developer-tools/LoremIpsum';
import InvoiceGenerator from '../tools/business-tools/InvoiceGenerator';
import QRCodeGenerator from '../tools/qr-tools/QRCodeGenerator';
import ImageResize from '../tools/image-tools/ImageResize';
import ImageCompress from '../tools/image-tools/ImageCompress';
import ImageConverter from '../tools/image-tools/ImageConverter';
import ImageToPdf from '../tools/image-tools/ImageToPdf';
import CnicDuplexPrintTool from '../tools/image-tools/CnicDuplexPrintTool';
import BackgroundRemover from '../tools/image-tools/BackgroundRemover';
import ImageEnhancer from '../tools/image-tools/ImageEnhancer';
import WordToPdf from '../tools/pdf-tools/WordToPdf';
import ExcelToPdf from '../tools/pdf-tools/ExcelToPdf';
import PdfToImage from '../tools/pdf-tools/PdfToImage';
import PdfSuiteTool, { toolInfo as pdfSuiteToolInfo } from '../tools/pdf-suite/PdfSuiteTool';

const PdfSuiteRoute = ({ toolId }) => <PdfSuiteTool toolId={toolId} />;

const pdfSuiteComponents = Object.keys(pdfSuiteToolInfo).reduce((components, id) => {
  components[id] = () => <PdfSuiteRoute toolId={id} />;
  return components;
}, {});

const readyToolComponents = {
  'word-counter': WordCounter,
  'character-counter': CharacterCounter,
  'case-converter': CaseConverter,
  'remove-extra-spaces': RemoveExtraSpaces,
  'text-to-slug': TextToSlug,
  'duplicate-line-remover': DuplicateLineRemover,
  'text-sorter': TextSorter,
  'find-and-replace': FindAndReplace,
  'emi-calculator': EmiCalculator,
  'gst-calculator': GstCalculator,
  'bmi-calculator': BmiCalculator,
  'age-calculator': AgeCalculator,
  'percentage-calculator': PercentageCalculator,
  'unit-converter': UnitConverter,
  'date-calculator': DateCalculator,
  'json-formatter': JsonFormatter,
  'base64-encoder': Base64Encoder,
  'url-encoder': UrlEncoder,
  'wifi-qr-generator': WifiQrGenerator,
  'whatsapp-qr-generator': WhatsAppQrGenerator,
  'barcode-generator': BarcodeGenerator,
  'vcard-qr-generator': VCardQrGenerator,
  'html-encoder': HtmlEncoder,
  'css-minifier': CssMinifier,
  'js-minifier': JsMinifier,
  'password-generator': PasswordGenerator,
  'lorem-ipsum': LoremIpsum,
  'invoice-generator': InvoiceGenerator,
  'qr-code-generator': QRCodeGenerator,
  'image-resize': ImageResize,
  'image-compress': ImageCompress,
  'image-converter': ImageConverter,
  'image-to-pdf': ImageToPdf,
  'cnic-id-card-duplex-print': CnicDuplexPrintTool,
  'background-remover': BackgroundRemover,
  'image-enhancer': ImageEnhancer,
  'word-to-pdf': WordToPdf,
  'excel-to-pdf': ExcelToPdf,
  'pdf-to-image': PdfToImage,
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
        {ToolComponent ? <ToolComponent /> : <ComingSoonTool tool={tool} />}
      </ToolLayout>
    </div>
  );
}

export default ToolPage;
