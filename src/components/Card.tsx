import { Card } from 'native-base';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  id?: number;
  nome_membro: string;
  barrio: string;
}
export const MyCard = ({ nome_membro, barrio }: Props) => {
  return (
    <Card style={styles.card}>
        <Text style={styles.name}>{nome_membro}</Text>
        <Text style={styles.bairro}>{barrio}</Text>
    </Card>
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


// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,

//     elevation: 5,
//   },
//   name: {
//     fontSize: 20,
//   },
//   bairro: {
//     fontSize: 16,
//     color: '#555',
//   },
// });

