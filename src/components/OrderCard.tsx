import { Card } from '@rneui/themed';
import React from 'react';
import {Text, Pressable} from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal } from 'react-native';
import { getOrderDetailsByOrderId } from 'src/api/api';
import Toast from 'react-native-toast-message';
import { ProductsList } from 'src/models';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {updateOrderStatus} from 'src/api/api';


type OrderProps = {
    orderID: string;
    supermarketID: string;
    cost: number;
    status: string;
};

const demoData: ProductsList[] = [
    { ItemID: "1", ItemName: 'Product 1', Quantity: 2, Price: 10 },
    { ItemID: "2", ItemName: 'Product 2', Quantity: 1, Price: 20 },
    { ItemID: "3", ItemName: 'Product 3', Quantity: 3, Price: 30 },
    { ItemID: "4", ItemName: 'Product 4', Quantity: 4, Price: 40 },
    { ItemID: "5", ItemName: 'Product 5', Quantity: 5, Price: 50 },
    { ItemID: "6", ItemName: 'Product 6', Quantity: 6, Price: 60 },
    { ItemID: "7", ItemName: 'Product 7', Quantity: 7, Price: 70 },
    { ItemID: "8", ItemName: 'Product 8', Quantity: 8, Price: 80 },
    { ItemID: "9", ItemName: 'Product 9', Quantity: 9, Price: 90 },
    { ItemID: "10", ItemName: 'Product 10', Quantity: 10, Price: 100 },
];

const logoPicture = ["https://i.ibb.co/Xt5bGQs/logo1.png","https://i.ibb.co/qrzSSWz/logo2.jpg","https://i.ibb.co/t2czvMG/logo3.png","https://i.ibb.co/x5xYM8Z/logo4.webp"]

const OrderCard: React.FC<OrderProps> = ({ orderID, supermarketID, cost, status }) => {
    const getIcon = (status: string) => {
        switch (status) {
          case 'Shipped':
            return '🚚';
          case 'Delivered':
            return '✅';
          case 'Cancelled':
            return '❌';
          case 'Pending':
            return '⏳';
          default:
            console.log("thefuck");
            return '❌';
        }
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState<ProductsList[]>(demoData);
    const [loading, setLoading] = useState(false);
    const [isPending, setIsPending] = useState(status === 'Pending');
    const [icon, setIcon] = useState(getIcon(status));
    const handleOpenDetailsModal = () => {
        setLoading(true);
        getOrderDetailsByOrderId(orderID)
            .then((response) => {
                // console.log(response);
                setLoading(false);
                setModalVisible(true);
                setProducts(response);
            })
            .catch((error) => {
                setModalVisible(true);
            });
            setLoading(false);
    };

    const handleCloseModal = () => {
        //make a api call to update the status of the order and make sure to reflect this in fornt end
        setModalVisible(false);
    };

    const handleStatusChange = () => {
        try {
            updateOrderStatus(orderID, 'Shipped');
            Toast.show({
                type: 'success',
                text1: 'Status Updated',
                text2: 'Order Sent!'
            })
            setIcon('🚚');
            setModalVisible(false);
            setIsPending(false);
          } catch (error) {
            console.log(error);
            //indicate to the user that we had a problem:
            Toast.show({
                type: 'error',
                text1: 'Sending failed',
                text2: 'Please check later.',
            });
          }
    }

    const getSuperMarketLogo = (supermarketID : string) => {
        switch(supermarketID[0]){
            case "E":
                return logoPicture[0];
            case "A":
                return logoPicture[1];
            case "3":
                return logoPicture[2];
            case "8":
                return logoPicture[1];
            default:
                return logoPicture[3];
        }
    }

    return (
        <View style={styles.card}>
            <Card>
            <Card.Title>
                <View style={{ display:'flex',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text>Order #{orderID}</Text>
                    <Text>{icon}</Text>
                </View>
            </Card.Title>
            <Card.Divider />
            <Card.Image
                style={{ padding: 0 }}
                source={{
                    uri:
                    getSuperMarketLogo(supermarketID),
                }}
                />
                <Text style={{ marginBottom: 10 }}>
                Total cost : {cost}$
                </Text>
                <Pressable 
                    style={({ pressed }) => [
                        styles.detailsButton,
                        pressed ? styles.buttonPressed : null,
                    ]}
                    onPress={handleOpenDetailsModal}
                >
                    <Text style={styles.buttonText}>Get Details</Text>
                    <Ionicons name="chevron-down" size={16} color="#fff" style={styles.icon} />
                </Pressable>
            </Card>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Toast/>
                    <View style={styles.titleContainer}>
                        <Text style={styles.modalTitle}>Order #{orderID} Details</Text>
                        <Pressable style={styles.closeButton1}  onPress={handleCloseModal}>
                            <Icon name="close" size={24} color="red" />
                        </Pressable>
                    </View>
                        <ScrollView style={styles.scrollView}>
                            <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableHeader}>Item Name</Text>
                                <Text style={styles.tableHeader}>Price</Text>
                                <Text style={styles.tableHeader}>Quantity</Text>
                            </View>
                            {products.map((item) => (
                                <View key={item.ItemID} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{item.ItemName}</Text>
                                    <Text style={styles.tableCell}>${item.Price}</Text>
                                    <Text style={styles.tableCell}>Quantity: {item.Quantity}</Text>
                                </View>
                            ))}
                        </View>
                        </ScrollView>
                        {isPending && (
                            <Pressable style={styles.saveButton} onPress={handleStatusChange}>
                                <Text style={styles.buttonText}>Send Order</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </Modal>
        </View>  
    );
}
const styles = StyleSheet.create({
    card: {
      width: '30%',
      margin: 10,
      height:400,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    icon: {
        marginLeft: 5,
    },
    buttonPressed: {
        backgroundColor: '#0056b3',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
        paddingLeft: 20,
    },
    productItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '500',
    },
    productQuantity: {
        fontSize: 16,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        width: '80%',
    },
    table: {
        width: '100%',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    scrollView: {
        width: '100%',
        // height: '20%',
    },
    tableHeader: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    closeButton1: {
        padding: 10, // Adding some padding for easier tapping
        justifyContent: 'center', // Align the button vertically in the middle
        alignItems: 'center', // Center the icon inside the button
    },
  });

export default OrderCard;