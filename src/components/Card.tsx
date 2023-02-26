import { Card } from 'native-base';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface Props extends TouchableOpacityProps {
  id?: number;
  nome_membro: string;
  barrio: string;
  onPress?: () => void;
}
export const MyCard = ({ nome_membro, barrio, onPress, ...rest }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} {...rest}>
    <Card style={styles.card}>
        <Text style={styles.name}>{nome_membro}</Text>
        <Text style={styles.bairro}>{barrio}</Text>
    </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  name: {
    fontSize: 20,
  },
  bairro: {
    fontSize: 14,
    color: '#555',
  },
});