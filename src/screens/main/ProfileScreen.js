'use client';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';
import {Header} from '../../components/layout/Header';
import {Button} from '../../components/ui/Button';
import {TabView} from '../../components/ui/TabView';
import {AnimatedFlatList} from '../../components/ui/AnimatedFlatList';
import Icon from 'react-native-vector-icons/Ionicons';
// import { useSelector } from "react-redux"

const ProfileScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {logout} = useAuth();
  // const user = useSelector((state) => state.user.data)

  // Mock data for tabs
  const postsData = Array.from({length: 10}, (_, i) => ({
    id: `post-${i}`,
    title: `Post ${i + 1}`,
    description: `This is a description for post ${i + 1}`,
    image: `https://picsum.photos/id/${i + 50}/200/200`,
    date: '2 days ago',
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
  }));

  const photosData = Array.from({length: 15}, (_, i) => ({
    id: `photo-${i}`,
    title: `Photo ${i + 1}`,
    image: `https://picsum.photos/id/${i + 100}/200/200`,
    date: '3 days ago',
    likes: Math.floor(Math.random() * 100),
  }));

  const likesData = Array.from({length: 8}, (_, i) => ({
    id: `like-${i}`,
    title: `Liked Item ${i + 1}`,
    description: `This is a description for liked item ${i + 1}`,
    image: `https://picsum.photos/id/${i + 150}/200/200`,
    date: '1 week ago',
    likes: Math.floor(Math.random() * 100),
  }));

  const handleLogout = async () => {
    await logout();
  };

  // Tab content components
  const PostsTab = () => (
    <View style={styles.tabContent}>
      <AnimatedFlatList
        data={postsData}
        onItemPress={item => console.log('Post pressed:', item)}
        animationType="scale"
      />
    </View>
  );

  const PhotosTab = () => (
    <View style={styles.tabContent}>
      <AnimatedFlatList
        data={photosData}
        onItemPress={item => console.log('Photo pressed:', item)}
        animationType="fade"
        numColumns={3}
        renderType="grid"
      />
    </View>
  );

  const LikesTab = () => (
    <View style={styles.tabContent}>
      <AnimatedFlatList
        data={likesData}
        onItemPress={item => console.log('Liked item pressed:', item)}
        animationType="slide"
      />
    </View>
  );

  const tabs = [
    {key: 'posts', title: 'Posts', component: PostsTab},
    {key: 'photos', title: 'Photos', component: PhotosTab},
    {key: 'likes', title: 'Likes', component: LikesTab},
  ];

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Header title="Profile" showBack={false} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          {/* <Image
            source={{
              uri: user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.avatar}
          /> */}
          <Text style={[styles.name, {color: theme.colors.text}]}>
            {' '}
            User Name
          </Text>
          <Text style={[styles.bio, {color: theme.colors.textSecondary}]}>
            Software Developer
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>
                125
              </Text>
              <Text
                style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                Posts
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>
                1.2k
              </Text>
              <Text
                style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                Followers
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>
                384
              </Text>
              <Text
                style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
                Following
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Edit Profile"
              variant="outlined"
              style={[styles.editButton, {borderColor: theme.colors.primary}]}
              textStyle={{color: theme.colors.primary}}
              theme={theme}
            />
            <TouchableOpacity
              style={[
                styles.settingsButton,
                {backgroundColor: theme.colors.backgroundSecondary},
              ]}>
              <Icon
                name="settings-outline"
                size={20}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TabView tabs={tabs} />
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outlined"
          style={[styles.logoutButton, {borderColor: theme.colors.error}]}
          textStyle={{color: theme.colors.error}}
          theme={theme}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flex: 1,
    height: 500, // Fixed height for the tab view
  },
  tabContent: {
    flex: 1,
  },
  logoutButton: {
    margin: 20,
    marginTop: 10,
  },
});

export default ProfileScreen;
