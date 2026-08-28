import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  UIManager,
  findNodeHandle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Icon from '../../theme/IconsProvider';

const screenHeight = Dimensions.get('window').height;
const DROPDOWN_HEIGHT = screenHeight * 0.4;
const ITEM_HEIGHT = 48;

const AnimatedDropdown = ({
  id,
  options = [],
  selected,
  setSelected,
  onSelect,
  placeholder = 'Select',
  nextInputRef,
  activeDropdown,
  setActiveDropdown,
  error,
  theme,
  loading = false,
}) => {
  const isOpen = activeDropdown === id;
  const buttonRef = useRef(null);
  const scale = useSharedValue(isOpen ? 1 : 0);
  const [dropdownTop, setDropdownTop] = React.useState(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
    opacity: scale.value,
  }));

  React.useEffect(() => {
    scale.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen]);

  const handleSelect = (item) => {
    setSelected(item);
    onSelect?.(item);
    setActiveDropdown(null);

    setTimeout(() => {
    if (nextInputRef?.current) {
      nextInputRef.current.focus();
    }
  }, 250);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      setActiveDropdown(null);
      return;
    }

    UIManager.measure(
      findNodeHandle(buttonRef.current),
      (x, y, width, height, pageX, pageY) => {
        const top = pageY - DROPDOWN_HEIGHT;
        setDropdownTop(Math.max(0, top));
        setActiveDropdown(id);
      }
    );
  };

  return (
    <View className="w-full relative mb-4">
      <TouchableOpacity
        ref={buttonRef}
        activeOpacity={0.8}
        onPress={toggleDropdown}
        className="w-full px-4 py-3 rounded-lg border flex-row items-center justify-between"
        style={{
          backgroundColor: theme.colors.primaryLight,
          borderColor: error ? theme.colors.error : theme.colors.primaryLight,
           minHeight: 55,
        }}
      >
        <Text
          style={{
            fontFamily: selected ? theme.typography.fontFamily.regular : theme.typography.fontFamily.regular,
            color: selected ? '#000' : theme.colors.textSecondary,
            fontSize:theme.typography.fontSize.m
          }}
          allowFontScaling={false}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Icon icon="downArrow" size={20} color={theme.colors.text} />
      </TouchableOpacity>

      {error && (
        <Text
          style={{
            color: theme.colors.error,
            marginTop: 4,
            fontFamily: theme.typography.fontFamily.regular,
            fontSize:theme.typography.fontSize.xs
          }}
          allowFontScaling={false}
        >
          {error}
        </Text>
      )}

      {isOpen && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: dropdownTop,
              backgroundColor: theme.colors.background,
              maxHeight: DROPDOWN_HEIGHT,
              width: '100%',
              zIndex: 50,
              borderRadius: 12,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 6,
            },
            animatedStyle,
          ]}
        >
          {loading ? (
  <View style={{ height: ITEM_HEIGHT * 3, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="small" color={theme.colors.primary} />
    <Text
      style={{
        marginTop: 10,
        color: theme.colors.textSecondary,
        fontFamily: theme.typography.fontFamily.regular,
        fontSize:theme.typography.fontSize.xs
      }}
    >
      Loading...
    </Text>
  </View>
) : (
  
          <ScrollView
  bounces={false}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{elevation: 4}}
>
  {options.length > 0 ? (
    options.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleSelect(item)}
        style={{
          height: ITEM_HEIGHT,
          paddingHorizontal: 16,
          justifyContent: 'center',
          backgroundColor: theme.colors.card,
        }}
      >
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.fontSize.s,
          }}
          allowFontScaling={false}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    ))
  ) : (
    <View
      style={{
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
      }}
    >
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.s,
        }}
        allowFontScaling={false}
      >
        No options available
      </Text>
    </View>
  )}
</ScrollView>

)}
        </Animated.View>
      )}
    </View>
  );
};

export default AnimatedDropdown;