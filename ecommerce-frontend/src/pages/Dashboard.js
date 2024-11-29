import React from 'react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Power BI / Tableau Dashboard</h1>
      <iframe
        src="https://public.tableau.com/views/Book1_17327549682010/Dashboard1?:embed=y&:display_count=yes"
        title="Tableau Dashboard"
        style={{
          width: '100%',
          height: '600px',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Dashboard;
