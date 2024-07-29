// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#cce5ff',
  },
  listItemText: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  scanText: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
  closeText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});