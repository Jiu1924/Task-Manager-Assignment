import React, { useState } from 'react';
import api from '../services/api';
import { BuildingOffice2Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ProjectForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    members: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/projects', formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create project');
    }
    setLoading(false);
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <BuildingOffice2Icon className="h-8 w-8 text-purple-400" />
          Create New Project
        </h2>
        <button
          onClick={onClose}
          className="glass p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="glass-dark p-4 rounded-xl mb-6 flex items-start gap-3 bg-red-500/10">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-gray-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Project Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Member IDs (comma separated)</label>
          <textarea
            value={formData.members.join(', ')}
            onChange={(e) => setFormData({...formData, members: e.target.value.split(',').map(m => m.trim()).filter(Boolean)})}
            rows="2"
            className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 resize-vertical"
            placeholder="user123, user456 (optional)"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 glass-dark hover:glass bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 hover:shadow-xl"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="opacity-25" />
                  <path d="M12 12c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1v-6c0-.55.45-1 1-1z" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="opacity-75" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="glass p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
            disabled={loading}
          >
            <XMarkIcon className="h-5 w-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
