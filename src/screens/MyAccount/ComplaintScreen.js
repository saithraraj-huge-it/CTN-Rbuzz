import React, {useState} from 'react';
import {View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {Header} from '../../components/layout/Header';
import {TabView} from '../../components/ui/TabView';
import ComplaintRequestTab from '../Dashboard/Tabs/ComplaintRequestTab';
import ComplaintListTab from '../Dashboard/Tabs/ComplaintListTab';

const ComplaintScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [refreshFlag, setRefreshFlag] = useState(0);
  const triggerRefresh = () => {
    setRefreshFlag(prev => prev + 1);
  };

  const tabs = [
    {
      key: 'Complaint Request',
      title: 'Complaint Request',
      component: props => (
        <ComplaintRequestTab {...props} onComplaintCreated={triggerRefresh} />
      ),
    },
    {
      key: 'ComplaintList',
      title: 'Complaint List',
      component: props => (
        <ComplaintListTab {...props} refreshFlag={refreshFlag} />
      ),
    },
  ];

  return (
    <View className="flex-1" style={{backgroundColor: theme.colors.background}}>
      <Header
        title="Complaint Request"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />
      <TabView tabs={tabs} />
    </View>
  );
};

export default ComplaintScreen;
