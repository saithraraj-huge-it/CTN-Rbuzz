import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal
} from 'react-native';

const SimpleActionMenu = ({ 
  menuItems = [], 
  renderTrigger,
  menuPosition = 'right'
}) => {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef(null);
  const [menuLayout, setMenuLayout] = useState({ x: 0, y: 0 });

  const showMenu = () => {
    if (triggerRef.current) {
      triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuLayout({
          x: menuPosition === 'right' ? pageX - 100 + width : pageX,
          y: pageY + height
        });
        setVisible(true);
      });
    }
  };

  const hideMenu = () => {
    setVisible(false);
  };

  const handleMenuItemPress = (item) => {
    hideMenu();
    if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <View>
      <TouchableOpacity 
        ref={triggerRef} 
        onPress={showMenu}
      >
        {renderTrigger ? renderTrigger() : (
          <Text style={styles.defaultTrigger}>•••</Text>
        )}
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={hideMenu}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={hideMenu}
        >
          <View 
            style={[
              styles.menuContainer, 
              { 
                top: menuLayout.y, 
                left: menuLayout.x 
              }
            ]}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.lastMenuItem
                ]}
                onPress={() => handleMenuItemPress(item)}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTrigger: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
  }
});

export default SimpleActionMenu;