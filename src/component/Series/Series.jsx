import React, { useState } from 'react';
import "../../Styles/Series/Series.css";
import SeriesContent from './SeriesContent/SeriesContent';
import SeasonContent from './SeasonContent/SeasonContent';

const Series = () => {
  const [activeTab, setActiveTab] = useState('series');

  return (
    <div className="series-container">
      <div className='text-ontop'>
        <h1 className='step1-heading'>Why Should I Create a Series?</h1>
        <p className='sub-org-info'>A series will help you assign very specific scenarios for assessment to each of your employees. Hence based on the Series, you can get accurate insights into the performance of your existing employees or the ones you're looking to recruit.</p>
        <p className='sub-org-info'>An example of a Series is <strong>New Hire Onboarding</strong> or <strong>Marketing Team</strong>.</p>
        
        <h2 className='step2-heading'>Next Step: Create a Season</h2>
        
        <h3 className='role-info'>Why Should I Create a Season?</h3>
        <p className='role-info'>A season helps you monitor individuals at a more granular level within a Series. If you have multiple seasons within a Series, you will be able to evaluate the progress at each stage.</p>
        <p className='role-info'>An example of a Season could be <strong>Pre</strong>, <strong>Mid</strong>, or <strong>Post</strong>. This will help you assess the individuals at each stage and see how they have progressed.</p>
    </div>
      <div className="buttons">
        <button
          className={activeTab === 'series' ? 'active' : ''}
          onClick={() => setActiveTab('series')}
        >
          Series
        </button>
        <button
          className={activeTab === 'season' ? 'active' : ''}
          onClick={() => setActiveTab('season')}
        >
          Season
        </button>
      </div>
      <div className="content">
        {activeTab === 'series' && <SeriesContent />}
        {activeTab === 'season' && <SeasonContent />}
      </div>
    </div>
  );
};

export default Series;
