import React, { useState } from 'react';
import api from '../services/api';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const TaskForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    project: '',
    dueDate: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/tasks', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create task');
    }
    setLoading(false);
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <PlusIcon className="h-8 w-8 text-green-400" />
          Create New Task
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
          <label className="block text-sm font-medium text-gray-200 mb-2">Task Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 resize-vertical"
            placeholder="Task description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Assign To *</label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              placeholder="User ID or email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 bg-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 glass-dark hover:glass bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 hover:shadow-xl"
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
              'Create Task'
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

export default TaskForm;
