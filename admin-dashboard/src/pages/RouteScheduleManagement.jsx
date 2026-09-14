import React from 'react';
import RouteTable from '../components/RouteTable';
import ScheduleEditor from '../components/ScheduleEditor';

export default function RouteScheduleManagement() {
  return (
    <div>
      <h2>Route & Schedule Management</h2>
      <RouteTable />
      <div style={{ marginTop: '24px' }}>
        <ScheduleEditor />
      </div>
    </div>
  );
}
