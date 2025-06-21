import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import SearchFilter from '../components/ui/SearchFilter';
import Loading from '../components/ui/Loading';
import ExportButton from '../components/ui/ExportButton';
import {
  FolderOpen,
  Activity,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// ...existing code...

const filteredProjects = projectsList.filter(project => {
  const matchesSearch = project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       project?.project_id?.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesSector = selectedSector === 'All' || project?.sector === selectedSector;
  const matchesStatus = selectedStatus === 'All' || project?.status === selectedStatus;
  
  return matchesSearch && matchesSector && matchesStatus;
});

// ...existing code...
