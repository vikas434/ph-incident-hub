"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Download, Share2, Loader2, Mail, Copy, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ActionToolbarProps {
  onLimitChange: (limit: number | null) => void;
}

export default function ActionToolbar({ onLimitChange }: ActionToolbarProps) {
  const params = useParams();
  const productID = params.sku as string;
  const [limit, setLimit] = useState<number | null>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleLimitChange = (value: string) => {
    const numValue = value === "all" ? null : parseInt(value);
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
    setIsDownloading(true);
    showToast("Capturing screen...", "info");
    
    try {
      // Wait a bit for the toast to show
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the main content area to capture
      const mainContent = document.querySelector('main');
      if (!mainContent) {
        throw new Error("Content area not found");
      }

      showToast("Converting to PDF...", "info");
      
      // Capture the content as canvas
      const canvas = await html2canvas(mainContent as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f1f5f9', // slate-50 background
        windowWidth: mainContent.scrollWidth,
        windowHeight: mainContent.scrollHeight,
      });

      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      // Generate filename with product ID and timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Product_Quality_Report_${productID}_${timestamp}.pdf`;
      
      // Save PDF
      pdf.save(filename);
      
      setIsDownloading(false);
      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsDownloading(false);
      showToast("Failed to generate PDF. Please try again.", "error");
    }
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
            <option value="10">Top 10</option>
            <option value="20">Top 20</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
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

