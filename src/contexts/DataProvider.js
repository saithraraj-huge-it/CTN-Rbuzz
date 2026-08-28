import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosGet, axiosPost } from '../utils/api';
import dayjs from 'dayjs';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loadingMaster, setLoadingMaster] = useState({});
  const [masterData, setMasterData] = useState({});
  const [loadingRecharge, setLoadingRecharge] = useState(false);
  const [rechargeResult, setRechargeResult] = useState(null);
  const [rechargeError, setRechargeError] = useState(null);

  const getPendingRecharge = async (itemId = 1) => {
    const sessionCookie = await AsyncStorage.getItem('auth_cookie');
    console.log(sessionCookie,"sessionCookie");
    
    try {
      const get =  `api/atomService/secure/getPendingRecharge?itemTypeId=${itemId}`
      console.log(get,"get");
      
      const response = await axiosGet.get(get,
        // `api/atomService/secure/getPendingRecharge?itemId=${itemId}`,
        { headers: { Cookie: sessionCookie } }
      );
      console.log(response,"responsegetpre");
      
      return response?.data?.LST || [];
    } catch (error) {
      console.error('Error fetching pending recharges:', error);
      return [];
    }
  };

  // Electricity
  const getPendingService = async (itemId = 4) => {
    const sessionCookie = await AsyncStorage.getItem('auth_cookie');
    try {
      const response = await axiosGet.get(
        `api/atomService/secure/getPendingService?itemTypeId=${itemId}`,
        { headers: { Cookie: sessionCookie } }
      );
      return response?.data?.LST || [];
    } catch (error) {
      console.error('Error fetching pending services:', error);
      return [];
    }
  };

  const fetchMaster = async (typeId) => {
    if (loadingMaster[typeId] || masterData[typeId]) return;

    setLoadingMaster((prev) => ({ ...prev, [typeId]: true }));
    try {
      const sessionCookie = await AsyncStorage.getItem('auth_cookie');

        
      const get = `api/atomService/secure/getMasters?itemTypeId=${typeId}`
      console.log(get,'master');
      

      const response = await axiosGet.get(
        // `/api/atomService/secure/getServiceProvider?itemTypeId=${typeId}`,
      get,  { headers: { Cookie: sessionCookie } }
      );

      console.log(response,"master");
      
      const options = response?.data?.LST?.map((item) => ({
        label: item.INM,
        value: item.IID,
      })) || [];

      setMasterData((prev) => ({
        ...prev,
        [typeId]: options,
      }));
    } catch (err) {
      console.error(`Error fetching master for typeId ${typeId}:`, err.message);
    } finally {
      setLoadingMaster((prev) => ({ ...prev, [typeId]: false }));
    }
  };

  const getMasterOptions = (typeId) => {
    if (!masterData[typeId]) {
      fetchMaster(typeId);
      return [];
    }
    return masterData[typeId];
  };

  const createRecharge = async ({ itemId, mobileNo, amount, pin }) => {
    setLoadingRecharge(true);
    setRechargeError(null);
    setRechargeResult(null);

    const payload = {
      entryDate: dayjs().format('YYYY/MM/DD'),
      itemId,
      mobileNo,
      amount,
      pinNo: pin,
    };

    console.log(payload,"payload Recharge");

    try {
      const response = await axiosPost.post('/api/atomService/secure/addRecharge', payload);
      if (response.data?.result) {
        setRechargeResult(response.data);
        console.log(response.data?.Message,"message");

        console.log(response,"respnse");
        

        return response.data;
      } else {
        setRechargeError(response.data?.Message);
        
        return null;
      }
    } catch (err) {
      setRechargeError(err?.response?.data?.Message || 'Something went wrong');
      return null;
    } finally {
      setLoadingRecharge(false);
    }
  };

  const createElectricityService = async ({
    itemId,
    serviceNumber,
    rechargeAmt,
    customerName,
    contactNumber,
    email,
    enteredPin,
  }) => {
    setLoadingRecharge(true);
    setRechargeError(null);
    setRechargeResult(null);

    const payload = {
      entryDate: dayjs().format('YYYY/MM/DD'),
      itemId,
      serviceNo: serviceNumber,
      amount: parseFloat(rechargeAmt),
      pinNo: enteredPin,
      customerName,
      contactNo: contactNumber,
      emailId: email,
    };


    console.log(payload,"payloadele");
    

    try {
      const response = await axiosPost.post('/api/atomService/secure/addService', payload);

      console.log(response,'resEle');
      
      if (response.data?.result) {
        setRechargeResult(response.data);
        console.log(response,"reselec");
        
        return response.data;
      } else {
        setRechargeError(response.data?.Message);
        return null;
      }
    } catch (err) {
      setRechargeError(err?.response?.data?.Message || 'Something went wrong');
      return null;
    } finally {
      setLoadingRecharge(false);
    }
  };


  const createTrafficChallan = async ({
  trafficChallanTypeId,
  mobileNumber,
  challanNumber,
  vehicleNumber,
  engineNumber,
  chassisNumber,
  DLNumber,
  amount,
  pinNo,
}) => {
  setLoadingRecharge(true);
  setRechargeError(null);
  setRechargeResult(null);

  const payload = {
    trafficChallanTypeId,
    entryDate: dayjs().format('YYYY/MM/DD'),
    mobileNumber,
    challanNumber,
    vehicleNumber,
    engineNumber,
    chassisNumber,
    DLNumber,
    amount,
    pinNo,
  };
  console.log(payload,"payload");
  

  try {
    const sessionCookie = await AsyncStorage.getItem('auth_cookie');
    const response = await axiosPost.post(
      '/api/atomService/secure/addTrafficChallan',
      payload,
      { headers: { Cookie: sessionCookie } }
    );

    if (response.data?.result) {
      setRechargeResult(response.data);
      console.log(response.data,"response");
      
      return response.data;
    } else {
      setRechargeError(response.data?.Message);
      return null;
    }
  } catch (err) {
    setRechargeError(err?.response?.data?.Message || 'Something went wrong');
    return null;
  } finally {
    setLoadingRecharge(false);
  }
};


const createComplaint = async ({complaintDetails , pin ,complaintTypeId}) => {
    setLoadingRecharge(true);
    setRechargeError(null);
    setRechargeResult(null);

    const payload = {
      entryDate: dayjs().format('YYYY/MM/DD'),
      complaintDetails,
      pinNo: pin,
      complaintTypeId:complaintTypeId
    };
      console.log(payload,"payload");
      
    try {
      const response = await axiosPost.post('/api/atomService/secure/addComplaint', payload);
      console.log(response,"resC");
      
      if (response.data?.result) {
        setRechargeResult(response.data);
        console.log(response.data,"v");
        
        return response.data;
      } else {
        setRechargeError(response.data?.Message);
        return null;
      }
    } catch (err) {
      setRechargeError(err?.response?.data?.Message || 'Something went wrong');
      return null;
    } finally {
      setLoadingRecharge(false);
    }
  };

  const getPendingComplaint = async () => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');
  try {
    const response = await axiosGet.get(
      'api/atomService/secure/getPendingComplaint',
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response?.data?.LST,"response?.data?.LST");
    
    return response?.data?.LST || [];
  } catch (error) {
    console.error('Error fetching pending Compliant:', error);
    return [];
  }
};

const getPendingTrafficChallan = async () => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');
  try {
    const response = await axiosGet.get(
      'api/atomService/secure/getPendingTrafficChallan',
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response,"challan");
    
    return response?.data?.LST || [];
  } catch (error) {
    console.error('Error fetching pending traffic challans:', error);
    return [];
  }
};

const getRechargeReport = async (fromDate, toDate) => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');

   const formattedFrom = dayjs(fromDate).format('YYYY/MM/DD');
  const formattedTo = dayjs(toDate).format('YYYY/MM/DD');

  try {
    const response = await axiosGet.get(
      `api/atomService/secure/listRecharge?fromDate=${formattedFrom}&toDate=${formattedTo}`,
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response.data,"response");

    return response?.data?.LST || [];
    
  } catch (error) {
    console.error('Error fetching Recharge Report:', error);
    return [];
  }
};

const getSalesReport = async (fromDate, toDate) => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');

   const formattedFrom = dayjs(fromDate).format('YYYY/MM/DD');
  const formattedTo = dayjs(toDate).format('YYYY/MM/DD');

  try {
    const response = await axiosGet.get(
      `api/atomService/secure/getSales?fromDate=${formattedFrom}&toDate=${formattedTo}`,
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response.data,"response");

    return response?.data?.LST || [];
    
  } catch (error) {
    console.error('Error fetching Sales Report:', error);
    return [];
  }
};

const getPurchaseReport = async (fromDate, toDate) => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');

   const formattedFrom = dayjs(fromDate).format('YYYY/MM/DD');
  const formattedTo = dayjs(toDate).format('YYYY/MM/DD');

  console.log(formattedFrom,"formattedFrom");
  

  try {
    const response = await axiosGet.get(
      `api/atomService/secure/getPurchase?fromDate=${formattedFrom}&toDate=${formattedTo}`,
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response.data,"response");

    return response?.data?.LST || [];
    
  } catch (error) {
    console.error('Error fetching Purchase Report:', error);
    return [];
  }
};

const getComplaintReport = async (fromDate, toDate) => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');

   const formattedFrom = dayjs(fromDate).format('YYYY/MM/DD');
  const formattedTo = dayjs(toDate).format('YYYY/MM/DD');

  try {
    const response = await axiosGet.get(
      `api/atomService/secure/listComplaint?fromDate=${formattedFrom}&toDate=${formattedTo}`,
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response.data,"response");

    return response?.data?.LST || [];
    
  } catch (error) {
    console.error('Error fetching Complaint Report:', error);
    return [];
  }
};

const getAccountInfo = async () => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');

  try {
    const response = await axiosGet.get(
      `api/atomService/secure/getAccountInfo`,
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response.data,"response");

    return response?.data?.LST || [];
    
  } catch (error) {
    console.error('Error fetching Account INFO Report:', error);
    return [];
  }
};

const getNotification = async () => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');

  console.log(sessionCookie,"sessionCookie");
  

  try {
    const response = await axiosGet.get(
      `api/atomService/secure/getNotification`,
      { headers: { Cookie: sessionCookie } }
    );
    console.log(response,"responseNot");

    return response?.data?.LST || [];
    
  } catch (error) {
    console.error('Error fetching Norification:', error);
    return [];
  }
};


const clearNotification = async () => {
  const sessionCookie = await AsyncStorage.getItem('auth_cookie');

  try {
    const response = await axiosPost.post(
      'api/atomService/secure/clearNotification',
      {}, 
      { headers: { Cookie: sessionCookie } }
    );

    console.log(response, "clearNotification response");

    return response?.data;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return null;
  }
};

const getComplaintTypes = async () => {
  try {
    const sessionCookie = await AsyncStorage.getItem('auth_cookie');

    const get = `api/atomService/secure/getMasters?itemTypeId=0`
    console.log(get,"mastercompleint");
    

    const response = await axiosGet.get(
      get,
      { headers: { Cookie: sessionCookie } }
    );

    console.log("Raw complaint types response:", response?.data);

    const complaintTypes = response?.data?.LST1?.map(item => ({
      label: item.CTN,
      value: item.CTI,
    })) || [];

    console.log("Mapped complaint types:", complaintTypes);

    return complaintTypes;
  } catch (error) {
    console.error('Error fetching complaint types:', error);
    return [];
  }
};

  return (
    <DataContext.Provider
      value={{
        getPendingRecharge,
        getPendingService,
        getMasterOptions,
        createTrafficChallan,
        getPendingTrafficChallan,
        loadingMaster,
        createRecharge,
        createElectricityService,
        getAccountInfo,
        loadingRecharge,
        rechargeResult,
        rechargeError,
        getRechargeReport,
        createComplaint,
        getPendingComplaint,
        getComplaintReport,
        getSalesReport,
        getPurchaseReport,
        getNotification,
        clearNotification,
        getComplaintTypes
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
