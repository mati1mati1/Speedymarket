import React from 'react';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
export default function Index() {
  const router = useRouter();
  useEffect(() => {
    //wait 2 seconds and redirect to login
    setTimeout(() => {
      router.replace('/login');
    }, 2000);
  }, []);
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
