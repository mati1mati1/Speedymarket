import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable, FlatList } from 'react-native';
import Dropdown from './Dropdown';

interface PopupWindowProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  items: Array<{ id: string; name: string }>;
  onSelectItem: (item: { id: string; name: string }) => void;
}

const PopupWindow: React.FC<PopupWindowProps> = ({ visible, title, onClose, items, onSelectItem }) => {
    return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <Text style={styles.title}>{title}</Text>
              <Dropdown items={items} onSelectItem={onSelectItem} placeholder="Select an item" />
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      );
    };

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default PopupWindow;