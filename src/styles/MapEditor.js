import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mapEditorContainer: {
    display: 'flex',
    justifyContent: 'center', /* Centers horizontally */
    alignItems: 'center', /* Centers vertically */
    height: '100vh', /* Full viewport height */
    width: '100%', /* Full viewport width */
    boxSizing: 'border-box',
    padding: 0,
  },
  mapEditorWrapper: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    flexGrow: 1,
    marginRight: '20px', /* Add space between the map and the sidebar */
  },
  
  /* Map styling */
  mapEditor: {
    borderRadius: '5px',
    overflow: hidden,
    position: relative,
    width: '800px', /* Fixed width for the map */
    height: '600px', /* Fixed height for the map */
    border: '1px solid black',
  },
  
  /* Sidebar on the right */
  sidebar: {
    display: flex,
    flexDirection: column,
    gap: '10px',
    alignItems: flex-start,
  },
  
  button: {
    display: block,
    padding: '10px',
    marginBottom: '10px',
    cursor: pointer,
    border: none,
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
  },

  
  btnSave: {
    backgroundColor: '#4CAF50',
    color: white,
  },
  
  btnClear: {
    backgroundColor: '#f44336',
    color: white,
  },
  
  btnAddSection, btnAddEntrance: {
    backgroundColor: '#008CBA',
    color: white,
  }
});

export default styles;
