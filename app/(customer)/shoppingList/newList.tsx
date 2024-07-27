import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Pressable } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ImagePickerResponse } from 'react-native-image-picker';
import { uploadGroceryListImage } from '../../../src/api/api';

const NewListPage: React.FC = () => {
    const [listItems, setListItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState<string>('');
    const [image, setImage] = useState<{ uri: string } | null>(null);

    interface ImageSource {
        uri: string;
    }

    const handleAddItem = () => {
        if (newItem.trim()) {
            setListItems([...listItems, newItem.trim()]);
            setNewItem('');
        }
    };

   
    
    const handleUploadImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, async (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const source: ImageSource = { uri: response.assets[0].uri as string };
                setImage(source); // Assuming setImage is defined elsewhere to update state or similar
                const res = await uploadGroceryListImage(source.uri);
                // Process the image here
                console.log('Image uploaded:', res);
                debugger;
                //add to the listItems the items from the image
                if (res.success) {
                    const items = res.list;
                    setListItems(items);
                }

            }
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Create Your Grocery List</Text>
                
                <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
                    <Text style={styles.uploadButtonText}>Upload List</Text>
                </TouchableOpacity>
                
                {image && <Image source={image} style={styles.image} />}
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add new item"
                        value={newItem}
                        onChangeText={setNewItem}
                    />
                    <Pressable onPress={handleAddItem}>
                        <Text>Add</Text>
                    </Pressable>
                </View>
                
                {listItems.length > 0 && (
                    <View style={styles.listContainer}>
                        <Text style={styles.listTitle}>Your Items:</Text>
                        {listItems.map((item, index) => (
                            <Text key={index} style={styles.listItem}>{item}</Text>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    uploadButton: {
        backgroundColor: '#6200ea',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
        paddingVertical: 5,
    },
    listContainer: {
        marginTop: 20,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
});

export default NewListPage;
