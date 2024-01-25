import React, { useState } from 'react';
import './Base.scss';
import { Button } from 'antd';
import SavingSegmentDrawer from './SavingSegmentDrawer/SavingSegmentDrawer';

function Base() {
  const [saveSegmentDrawerOpen, setSaveSegmentDrawerOpen] = useState(false);
  return (
    <div className='base'>
      <Button onClick={() => setSaveSegmentDrawerOpen(true)}>Save segment</Button>
      <SavingSegmentDrawer
        saveSegmentDrawerOpen={saveSegmentDrawerOpen}
        setSaveSegmentDrawerOpen={setSaveSegmentDrawerOpen}
      />
    </div>
  )
}

export default Base;