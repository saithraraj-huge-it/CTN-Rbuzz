import React, {useState, useEffect} from 'react';
import {useConnectivity} from '../../contexts/ConnectivityContext';
import NoInternetScreen from '../../screens/NoInternetScreen';

const ConnectionGate = ({children}) => {
  const {isConnected, checkConnection} = useConnectivity();
  const [checked, setChecked] = useState(false);

  const handleRetry = async () => {
    const connected = await checkConnection();
    setChecked(true);
  };

  useEffect(() => {
    if (isConnected !== null) {
      setChecked(true);
    }
  }, [isConnected]);

  if (!isConnected && checked) {
    return <NoInternetScreen onRetry={handleRetry} />;
  }

  return <>{children}</>;
};

export default ConnectionGate;
