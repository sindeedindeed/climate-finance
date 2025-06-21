import React, { useState } from 'react';
import { Github, Mail, Twitter, AlertTriangle } from 'lucide-react';
import Button from './Button';
import ReportIssueModal from './ReportIssueModal';

const Footer = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
    { icon: <Github size={16} />, href: '#', label: 'GitHub' },
    { icon: <Mail size={16} />, href: 'mailto:contact@climatefinance.gov.bd', label: 'Email' }
  ];

  return (
    <>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Copyright */}
              <p className="text-sm text-gray-500 text-center md:text-left">
                © {currentYear} Bangladesh Climate Finance Tracker. All rights reserved.
              </p>
              
              {/* Center - Report Issue Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReportModalOpen(true)}
                  leftIcon={<AlertTriangle size={14} />}
                  className="text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                >
                  Report Issue
                </Button>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-end gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
};

export default Footer;