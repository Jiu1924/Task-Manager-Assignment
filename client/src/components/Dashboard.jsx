import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskForm from './TaskForm';
import { ChartBarIcon, UserGroupIcon, CheckCircleIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      
      const now = new Date();
      const total = res.data.length;
      const completed = res.data.filter(t => t.status === 'Completed').length;
      const overdue = res.data.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed').length;
      
      setStats({ total, completed, overdue });
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
    setLoading(false);
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
      loadTasks(); // Refresh stats
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTasks();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Task Dashboard</h1>
            <p className="text-gray-300">
              Welcome back, <span className="font-semibold text-blue-400 capitalize">{user.role}</span> {user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="glass p-3 rounded-xl text-gray-200 hover:text-white flex items-center gap-2 transition-all"
            >
              {refreshing ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5" />
              )}
              Refresh
            </button>
            {user.role === 'Admin' && (
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="glass-dark hover:glass p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 shadow-lg hover:shadow-2xl transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                {showTaskForm ? 'Cancel' : 'New Task'}
              </button>
            )}
            <button
              onClick={logout}
              className="glass-dark hover:glass p-3 rounded-xl text-gray-200 hover:text-white flex items-center gap-2 transition-all"
            >
              <XMarkIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <ChartBarIcon className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Total Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <ClockIcon className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Overdue</h3>
          </div>
          <p className="text-3xl font-bold text-orange-400">{stats.overdue}</p>
        </div>
      </div>

      {/* Task Form (Admin only) */}
      {user.role === 'Admin' && showTaskForm && (
        <div className="glass p-6 rounded-2xl">
          <TaskForm onClose={() => setShowTaskForm(false)} onSuccess={loadTasks} />
        </div>
      )}

      {/* Tasks List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">Your Tasks</h2>
          <p className="text-gray-400">Manage your assigned tasks</p>
        </div>
        <div className="divide-y divide-white/10">
          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No tasks assigned</h3>
              <p className="text-gray-500">Tasks will appear here when assigned</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
                    <p className="text-gray-400 mt-1">{task.description || 'No description'}</p>
                    {task.project && (
                      <p className="text-sm text-blue-400 mt-1">Project: {task.project.name}</p>
                    )}
                    {task.dueDate && (
                      <p className="text-sm mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          new Date(task.dueDate) < new Date() && task.status !== 'Completed'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : task.status === 'In Progress' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {task.status}
                    </span>
                    <button
                      onClick={() => updateTask(task._id, { status: task.status === 'Completed' ? 'Pending' : task.status === 'In Progress' ? 'Pending' : 'In Progress' })}
                      className="glass p-2 rounded-xl hover:bg-white/10 transition-all flex items-center gap-1 text-sm text-gray-300 hover:text-white"
                      title="Update status"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
