"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, Share2, Loader2, Mail, Copy, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Evidence } from "@/lib/types";

interface ActionToolbarProps {
  onLimitChange: (limit: number | null) => void;
  skuData?: {
    name: string;
    sku: string;
    wayfairSKU?: string;
    productID?: string;
    manufacturer: string;
    evidence: Evidence[];
  };
}

export default function ActionToolbar({ onLimitChange, skuData }: ActionToolbarProps) {
  const params = useParams();
  const productID = params.sku as string;
  const [limit, setLimit] = useState<number | null>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleLimitChange = (value: string) => {
    // When "All" is selected, set to 50 items by default
    const numValue = value === "all" ? 50 : parseInt(value);
    setLimit(numValue);
    onLimitChange(numValue);
  };

  const generateShareToken = () => {
    // Generate a unique token for the share link
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${productID}_${timestamp}_${random}`;
  };

  const handleShare = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate share link (quick loading)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const token = generateShareToken();
    const publicLink = `${window.location.origin}/share/${token}`;
    
    // Store token in localStorage for demo purposes (in real app, this would be stored in backend)
    if (typeof window !== "undefined") {
      localStorage.setItem(`share_token_${token}`, productID);
    }
    
    setShareLink(publicLink);
    setIsGenerating(false);
    showToast("Public link generated successfully", "success");
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      showToast("Link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendEmail = () => {
    if (!emailAddress || !shareLink) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    
    // Create mailto link with subject and body
    const subject = encodeURIComponent(`Product Quality Report - ${productID}`);
    const body = encodeURIComponent(`Please review the product quality report:\n\n${shareLink}`);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    showToast("Email client opened", "success");
  };

  const handleCloseShare = () => {
    setShareLink(null);
    setEmailAddress("");
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    showToast("Generating PDF report...", "info");
    
    try {
      // Simulate PDF generation (in a real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a simple HTML report that can be printed/saved as PDF
      const reportContent = generatePDFContent();
      
      // Create a blob and trigger download
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Product_Quality_Report_${productID}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast("PDF report downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Failed to generate PDF. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFContent = (): string => {
    const productName = skuData?.name || productID;
    const wayfairSKU = skuData?.wayfairSKU || 'N/A';
    const manufacturer = skuData?.manufacturer || 'N/A';
    const evidenceCount = skuData?.evidence?.length || 0;
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Product Quality Report - ${productID}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      border-bottom: 2px solid #7c3aed;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #7c3aed;
      margin: 0;
    }
    .info-section {
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      width: 150px;
    }
    .summary {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .evidence-list {
      margin-top: 20px;
    }
    .evidence-item {
      border: 1px solid #ddd;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body { margin: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Product Quality Report</h1>
    <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  
  <div class="info-section">
    <h2>Product Information</h2>
    <div class="info-row">
      <div class="info-label">Product ID:</div>
      <div>${productID}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Product Name:</div>
      <div>${productName}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Wayfair SKU:</div>
      <div>${wayfairSKU}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Manufacturer:</div>
      <div>${manufacturer}</div>
    </div>
  </div>
  
  <div class="summary">
    <h2>Summary</h2>
    <p><strong>Total Evidence Items:</strong> ${evidenceCount}</p>
    <p>This report contains quality incident evidence and documentation for the above product.</p>
  </div>
  
  <div class="evidence-list">
    <h2>Evidence Details</h2>
    ${skuData?.evidence?.slice(0, limit || 10).map((item: any, idx: number) => `
      <div class="evidence-item">
        <h3>Evidence #${idx + 1}</h3>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Defect Type:</strong> ${item.defectType}</p>
        <p><strong>Program:</strong> ${item.program}</p>
        <p><strong>Severity:</strong> ${item.severity}</p>
        <p><strong>Note:</strong> ${item.note || 'N/A'}</p>
      </div>
    `).join('') || '<p>No evidence items available.</p>'}
  </div>
  
  <div class="footer">
    <p>Partner Home - XYZ Supplier Quality Report</p>
    <p>This is an automated report generated from the Incident Photo Hub system.</p>
  </div>
</body>
</html>`;
  };

  return (
    <>
      {/* Share Modal */}
      {shareLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share with Factory</h3>
              <button
                onClick={handleCloseShare}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Public Share Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This link can be accessed without login
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send via Email
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="factory@example.com"
                    className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendEmail}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="limit-select" className="text-sm font-medium text-gray-700">
            Limit to:
          </label>
          <select
            id="limit-select"
            value={limit === null ? "all" : limit.toString()}
            onChange={(e) => handleLimitChange(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share with Factory
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

