import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';

interface DropdownProps {
  items: Array<{ id: string; name: string }>;
  onSelectItem: (item: { id: string; name: string }) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ items, onSelectItem, placeholder = "Select an item" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);

  const handleSelectItem = (item: { id: string; name: string }) => {
    setSelectedItem(item);
    onSelectItem(item);
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdown}>
      <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.dropdownHeader}>
        <Text style={styles.dropdownHeaderText}>
          {selectedItem ? selectedItem.name : placeholder}
        </Text>
      </Pressable>
      {isOpen && (
        <View style={styles.dropdownList}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleSelectItem(item)} style={styles.dropdownListItem}>
                <Text style={styles.dropdownListItemText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    marginVertical: 10,
  },
  dropdownHeader: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  dropdownListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownListItemText: {
    fontSize: 16,
  },
});

export default Dropdown;