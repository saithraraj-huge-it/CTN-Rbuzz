
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';

import Icon from '../../theme/IconsProvider';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get('window');

const ITEM_HEIGHT = 48;
const MAX_DROPDOWN_HEIGHT = SCREEN_HEIGHT * 0.4;

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
  const buttonRef = useRef(null);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const isOpen = activeDropdown === id;

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
      return;
    }

    buttonRef.current?.measureInWindow(
      (x, y, width, height) => {
        const dropdownHeight = Math.min(
          MAX_DROPDOWN_HEIGHT,
          Math.max(ITEM_HEIGHT, options.length * ITEM_HEIGHT)
        );

        const spaceBelow = SCREEN_HEIGHT - (y + height);
        const openAbove = spaceBelow < dropdownHeight;

        let top = openAbove
          ? y - dropdownHeight
          : y + height;

        top = Math.max(
          0,
          Math.min(top, SCREEN_HEIGHT - dropdownHeight)
        );

        const left = Math.max(
          0,
          Math.min(x, SCREEN_WIDTH - width)
        );

        setDropdownPosition({
          top,
          left,
          width,
          height: dropdownHeight,
        });

        setActiveDropdown(id);
      }
    );
  };

  const handleSelect = item => {
    setSelected(item);
    onSelect?.(item);
    closeDropdown();

    setTimeout(() => {
      nextInputRef?.current?.focus?.();
    }, 150);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => handleSelect(item)}
      style={{
        height: ITEM_HEIGHT,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: theme.colors.card,
        borderBottomWidth:
          index === options.length - 1 ? 0 : 0.5,
        borderBottomColor: '#E5E7EB',
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
  );

  return (
    <View className="w-full relative mb-4">

      {/* DROPDOWN BUTTON */}

      <TouchableOpacity
        ref={buttonRef}
        activeOpacity={0.8}
        onPress={toggleDropdown}
        className="w-full px-4 py-3 rounded-lg border flex-row items-center justify-between"
        style={{
          backgroundColor: theme.colors.primaryLight,
          borderColor: error
            ? theme.colors.error
            : theme.colors.primaryLight,
          minHeight: 55,
        }}
      >
        <Text
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            color: selected ? '#000' : theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.m,
          }}
          allowFontScaling={false}
        >
          {selected?.label ?? placeholder}
        </Text>

        <Icon
          icon="downArrow"
          size={20}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {/* ERROR */}

      {error && (
        <Text
          style={{
            color: theme.colors.error,
            marginTop: 4,
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.fontSize.xs,
          }}
        >
          {error}
        </Text>
      )}

      {/* DROPDOWN MODAL */}

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDropdown}
      >
        <View style={{ flex: 1 }}>

          {/* OUTSIDE CLICK */}

          <Pressable
            onPress={closeDropdown}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* DROPDOWN LIST */}

          <View
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              height: dropdownPosition.height,
              backgroundColor: theme.colors.background,
              borderRadius: 12,
              overflow: 'hidden',
              elevation: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                />

                <Text
                  style={{
                    marginTop: 10,
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily.regular,
                  }}
                >
                  Loading...
                </Text>
              </View>
            ) : (
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  String(item.value ?? item.id ?? index)
                }
                showsVerticalScrollIndicator
                nestedScrollEnabled
                keyboardShouldPersistTaps="always"
                bounces={false}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                windowSize={7}
                getItemLayout={(data, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                ListEmptyComponent={
                  <View
                    style={{
                      height: ITEM_HEIGHT,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontFamily: theme.typography.fontFamily.regular,
                      }}
                    >
                      No options available
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AnimatedDropdown;
