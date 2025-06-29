import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { useToast } from '../components/ui/Toast';
import { pendingProjectApi } from '../services/api';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatters';

const AdminProjectApproval = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pendingProjectApi.getAll();
      if (response.status) {
        setPendingProjects(response.data);
      } else {
        setError('Failed to fetch pending projects');
      }
    } catch (err) {
      setError('Error loading pending projects');
      console.error('Error fetching pending projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId) => {
    try {
      setProcessingId(projectId);
      const response = await pendingProjectApi.approve(projectId);
      if (response.status) {
        toast({
          title: 'Success',
          message: 'Project approved successfully',
          type: 'success'
        });
        // Remove from pending list
        setPendingProjects(prev => prev.filter(p => p.pending_id !== projectId));
      } else {
        toast({
          title: 'Error',
          message: response.message || 'Failed to approve project',
          type: 'error'
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        message: 'Failed to approve project',
        type: 'error'
      });
      console.error('Error approving project:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (projectId) => {
    try {
      setProcessingId(projectId);
      const response = await pendingProjectApi.reject(projectId);
      if (response.status) {
        toast({
          title: 'Success',
          message: 'Project rejected successfully',
          type: 'success'
        });
        // Remove from pending list
        setPendingProjects(prev => prev.filter(p => p.pending_id !== projectId));
      } else {
        toast({
          title: 'Error',
          message: response.message || 'Failed to reject project',
          type: 'error'
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        message: 'Failed to reject project',
        type: 'error'
      });
      console.error('Error rejecting project:', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <Loading size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Approval</h1>
        <p className="text-gray-600">Review and approve pending project submissions</p>
      </div>

      {error && (
        <Card padding="p-6" className="mb-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={fetchPendingProjects}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {pendingProjects.length === 0 ? (
        <Card padding="p-8">
          <div className="text-center">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Projects</h3>
            <p className="text-gray-600">All project submissions have been reviewed.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingProjects.map((project) => (
            <Card key={project.pending_id} padding="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.type && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {project.type}
                          </span>
                        )}
                        {project.sector && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {project.sector}
                          </span>
                        )}
                        {project.status && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {project.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Submitted: {formatDate(project.submitted_at)}</p>
                      <p>By: {project.submitter_email}</p>
                    </div>
                  </div>

                  {project.objectives && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Objectives</h4>
                      <p className="text-gray-600 text-sm">{project.objectives}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {project.total_cost_usd && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Total Cost</span>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(project.total_cost_usd)}
                        </p>
                      </div>
                    )}
                    {project.gef_grant && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">GEF Grant</span>
                        <p className="text-lg font-semibold text-blue-600">
                          {formatCurrency(project.gef_grant)}
                        </p>
                      </div>
                    )}
                    {project.beginning && project.closing && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Timeline</span>
                        <p className="text-sm text-gray-900">
                          {formatDate(project.beginning)} - {formatDate(project.closing)}
                        </p>
                      </div>
                    )}
                  </div>

                  {project.beneficiaries && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">Beneficiaries</span>
                      <p className="text-sm text-gray-900">{project.beneficiaries}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:flex-shrink-0">
                  <Button
                    variant="success"
                    leftIcon={<CheckCircle size={16} />}
                    onClick={() => handleApprove(project.pending_id)}
                    disabled={processingId === project.pending_id}
                    className="w-full lg:w-auto"
                  >
                    {processingId === project.pending_id ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant="danger"
                    leftIcon={<XCircle size={16} />}
                    onClick={() => handleReject(project.pending_id)}
                    disabled={processingId === project.pending_id}
                    className="w-full lg:w-auto"
                  >
                    {processingId === project.pending_id ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default AdminProjectApproval; 