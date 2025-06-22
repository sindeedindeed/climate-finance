import React from 'react';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import Card from '../components/ui/Card';
import { Info, BarChart2, Users, Target } from 'lucide-react';

const AboutPage = () => {
  return (
    <PageLayout>
      <PageHeader
        title="About the Climate Finance Tracker"
        description="Understanding the flow of climate finance in Bangladesh."
        icon={<Info size={28} />}
      />

      <div className="space-y-8">
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target size={24} className="mr-3 text-purple-600" />
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Bangladesh Climate Finance Tracker is a public platform designed to bring transparency and accessibility to climate finance data. Our mission is to empower policymakers, researchers, journalists, and the public with comprehensive, up-to-date information on climate-related projects and funding sources across Bangladesh.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              By providing detailed insights into financial flows, project statuses, and sectoral allocations, we aim to support effective decision-making, enhance accountability, and foster a greater understanding of the national response to climate change.
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart2 size={24} className="mr-3 text-purple-600" />
              What We Track
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Projects:</strong> Detailed information on climate adaptation and mitigation projects, including status, sector, location, and objectives.</li>
              <li><strong>Funding Sources:</strong> Tracking commitments and disbursements from various development partners and national sources.</li>
              <li><strong>Financial Data:</strong> Analysis of total investments, grants, loans, and co-financing across different sectors and regions.</li>
              <li><strong>Impact Metrics:</strong> Data on beneficiaries and key performance indicators where available.</li>
            </ul>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users size={24} className="mr-3 text-purple-600" />
              Our Data
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The data presented on this platform is aggregated from publicly available sources, including reports from government agencies, development partners, and international climate funds. We strive to ensure the accuracy and timeliness of our data, but we encourage users to consult the original sources for official records.
            </p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AboutPage; 