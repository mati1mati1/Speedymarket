import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mapEditor: {
    width: 800,
    height: 600,
    borderColor: 'black',
    borderWidth: 1,
    position: 'relative',
    marginVertical: 20,
    marginHorizontal: 'auto',
    backgroundColor: '#f0f0f0',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 20,
    backgroundColor: '#ddd',
    height: '100%',
  },
  section: {
    width: 100,
    height: 50,
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    lineHeight: 50, // Not supported in React Native, needs an alternative
    borderColor: '#0056b3',
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: 'white',
    position: 'absolute',
    top: -10,
    left: 45,
  },
  entrance: {
    width: 100,
    height: 50,
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    lineHeight: 50, // Not supported in React Native, needs an alternative
    borderColor: '#004d00',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aisle: {
    backgroundColor: 'yellow',
    borderColor: '#cccc00',
    borderWidth: 1,
    position: 'absolute',
    cursor: 'pointer', // Not supported in React Native, use onPress for functionality
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start', // Aligns modals at the top
    paddingTop: 20, // Adds some padding from the top
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'hidden', // overflow-y is not supported, use ScrollView if needed
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, // Not directly supported in React Native, use margin or padding
    marginBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  mapEditor: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'black'
  },
  sidebar: {
    padding: 10
  }
});

export default styles;
