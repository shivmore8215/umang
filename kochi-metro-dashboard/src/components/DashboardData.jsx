import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { fetchStats } from '../api';

const DashboardData = () => {
  const [stats, setStats] = useState({
    trainsReady: 0,
    totalTrains: 0,
    maintenanceAlerts: 0,
    adDeadlines: 0,
    systemHealth: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    // Refresh data every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatCard
        title="Trains Ready"
        value={stats.trainsReady}
        total={stats.totalTrains}
        icon="train"
      />
      <StatCard
        title="Maintenance Alerts"
        value={stats.maintenanceAlerts}
        label="Active"
        icon="alert"
      />
      <StatCard
        title="Ad Deadlines"
        value={stats.adDeadlines}
        label="This Week"
        icon="calendar"
      />
      <StatCard
        title="System Health"
        value={`${stats.systemHealth}%`}
        label="Uptime"
        icon="health"
      />
    </div>
  );
};

export default DashboardData;