import React, { useState } from 'react';
import { TouchableOpacity, TextInput, View, Text,StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';

type EditPopoverProps = {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
};

export function EditPopover(props: EditPopoverProps) {
  const { label, value, onSave } = props;
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [novoValor, setNovoValor] = useState(value);

  const onSalvarPress = () => {
    onSave(novoValor);
    setPopoverVisible(false);
  };

  return (
    <Popover
      isVisible={popoverVisible}
      onRequestClose={() => setPopoverVisible(false)}
      from={
        <TouchableOpacity onPress={() => setPopoverVisible(true)}>
          <Icon as={MaterialIcons} name='edit' color='gray.200' size={5} marginLeft={260} />
        </TouchableOpacity>
      }>
      <View style={styles.popoverContent}>
        <Text style={styles.popoverTitle}>Editar {label}:</Text>
        <TextInput
          style={styles.popoverInput}
          value={novoValor}
          onChangeText={setNovoValor}
        />
        <View style={styles.popoverButtons}>
          <TouchableOpacity onPress={() => setPopoverVisible(false)}>
            <Text style={styles.popoverButton}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSalvarPress}>
            <Text style={styles.popoverButton}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Popover>
  );
}

const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 4,
      marginVertical: 2,
      marginHorizontal: 4,
      shadow: 2,
      borderWidth: 1,
      borderColor: 'muted.200',
    },
    cardText: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 4,
      marginVertical: 2,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: '#dcdcdc',  
      marginRight: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.10,
      shadowRadius: 3.84,
      elevation: 8,
    },
   
    foto:{
      width:120,
      height:120,
   
    },
    texto:{
      color: 'black',
      fontWeight: 'bold',
      fontSize:15,
     
    },
    textoMembro:{
      color:'#808080',    
    },
  
    cardTextFoto: {
      // flexDirection: 'row',
      alignItems: 'center',
    },
  
    textCardeDaFotoNome:{
      marginRight: 8,
      fontSize:12,
      margin: 2
    },
    popoverContent: {
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 8,
    },
    popoverTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    popoverInput: {
      borderWidth: 1,
      width: 250,
      borderColor: '#dcdcdc',
      borderRadius: 4,
      padding: 8,
      marginBottom: 8,
    },
    popoverButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    popoverButton: {
      color: 'blue',
      marginLeft: 16,
    },
    
  });