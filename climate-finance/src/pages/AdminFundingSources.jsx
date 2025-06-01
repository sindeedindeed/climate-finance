import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { fundingSources } from '../data/mock/adminData';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { ArrowLeft } from 'lucide-react';

const AdminFundingSources = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sources, setSources] = useState(fundingSources);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    dev_partner: '',
    grant_amount: '',
    loan_amount: '',
    counterpart_funding: '',
    non_grant_instrument: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dev_partner: '',
      grant_amount: '',
      loan_amount: '',
      counterpart_funding: '',
      non_grant_instrument: ''
    });
    setEditingSource(null);
  };

  const openModal = (source = null) => {
    if (source) {
      setEditingSource(source);
      setFormData({
        name: source.name,
        dev_partner: source.dev_partner,
        grant_amount: source.grant_amount || '',
        loan_amount: source.loan_amount || '',
        counterpart_funding: source.counterpart_funding || '',
        non_grant_instrument: source.non_grant_instrument || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sourceData = {
        ...formData,
        grant_amount: parseFloat(formData.grant_amount) || 0,
        loan_amount: parseFloat(formData.loan_amount) || 0,
        counterpart_funding: parseFloat(formData.counterpart_funding) || 0,
        non_grant_instrument: formData.non_grant_instrument || null
      };

      if (editingSource) {
        sourceData.funding_source_id = editingSource.funding_source_id;
        setSources(prev => prev.map(s => 
          s.funding_source_id === editingSource.funding_source_id ? sourceData : s
        ));
      } else {
        sourceData.funding_source_id = Math.max(...sources.map(s => s.funding_source_id)) + 1;
        setSources(prev => [...prev, sourceData]);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving funding source:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (sourceId) => {
    if (window.confirm('Are you sure you want to delete this funding source?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSources(prev => prev.filter(s => s.funding_source_id !== sourceId));
      } catch (error) {
        console.error('Error deleting funding source:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.dev_partner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Funding Sources</h1>
                <p className="text-sm text-gray-600">Manage funding sources and development partners</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <input
                type="text"
                placeholder="Search funding sources..."
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => openModal()} className="bg-primary-600 hover:bg-primary-700 text-white">
              Add Funding Source
            </Button>
          </div>
        </div>

        {/* Funding Sources Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funding Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grant Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Counterpart Funding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSources.map((source) => (
                  <tr key={source.funding_source_id} className="hover:bg-primary-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {source.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {source.dev_partner}
                        </div>
                        {source.non_grant_instrument && (
                          <div className="text-xs text-primary-600">
                            {source.non_grant_instrument}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(source.grant_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(source.loan_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(source.counterpart_funding)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => openModal(source)}
                          size="sm"
                          variant="outline"
                          className="text-primary-600 border-primary-600 hover:bg-primary-50 hover:text-primary-700"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(source.funding_source_id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No funding sources found</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSource ? 'Edit Funding Source' : 'Add New Funding Source'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Development Partner</label>
                    <input
                      type="text"
                      name="dev_partner"
                      value={formData.dev_partner}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grant Amount (USD)</label>
                    <input
                      type="number"
                      name="grant_amount"
                      value={formData.grant_amount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loan Amount (USD)</label>
                    <input
                      type="number"
                      name="loan_amount"
                      value={formData.loan_amount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Counterpart Funding (USD)</label>
                    <input
                      type="number"
                      name="counterpart_funding"
                      value={formData.counterpart_funding}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Non-Grant Instrument</label>
                    <input
                      type="text"
                      name="non_grant_instrument"
                      value={formData.non_grant_instrument}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Concessional Loan, Technical Assistance"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    onClick={closeModal}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loading size="sm" /> : (editingSource ? 'Update Source' : 'Create Source')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFundingSources;