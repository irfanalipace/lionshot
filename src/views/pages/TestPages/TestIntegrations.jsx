import React, { useState } from 'react';
import integrationService, {
  apps
} from '../../../core/services/integrationService';

function TestIntegrations() {
  const [integrationApps, setIntegrationApps] = useState(apps);
  const [isDisabled, setIsDisabled] = useState(false);

  const addApp = app => {
    setIntegrationApps(prev => {
      return {
        ...prev,
        [app]: {
          ...prev[app],
          loading: true
        }
      };
    });
    setIsDisabled(true);
    integrationService.init({
      app,
      callback: () => {
        setIntegrationApps(prev => {
          return {
            ...prev,
            [app]: {
              ...prev[app],
              loading: false
            }
          };
        });
        setIsDisabled(false);
      }
    });
  };
  return (
    <div>
      {Object.entries(integrationApps)?.map(([key, value]) => (
        <button disabled={isDisabled} key={key} onClick={() => addApp(key)}>
          {value?.loading ? 'Loading...' : `Add ${value.name}`}
        </button>
      ))}
    </div>
  );
}

export default TestIntegrations;
