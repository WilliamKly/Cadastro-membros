import { Card, Icon, ScrollView } from 'native-base';
import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { VictoryChart, VictoryBar, VictoryPie, VictoryLine, VictoryTheme, VictoryLabel } from 'victory-native';
import { MaterialIcons } from '@expo/vector-icons'
// import { ApiResponse } from '@screens/Home';


export interface ApiResponse {
  Membros: number;
  status_code: number;
}


interface DashboardIndicadoresProps {
  membros?: ApiResponse;
}



export function DashboardIdicadores (props: DashboardIndicadoresProps)  {


  const membros = props.membros;


  return (
    <>

     <View style={styles.container}>

     <View style={styles.container}>
     <ScrollView horizontal={true}>

     <View style={{ width: '36%' }}>

      <View style={styles.card}>
      <Icon
              as={MaterialIcons}
              name='groups'
              color='gray.200'
              size={6}
           />
        <Text style={styles.cardTitle}>Qtd. de Membros</Text>

        <Text style={styles.cardContent}>{membros?.Membros}</Text>
      </View>
     </View>


     <View style={{ width: '36%' }}>

     <View style={styles.card}>
     <Icon
              as={MaterialIcons}
              name='person'
              color='gray.200'
              size={6}
           />
        <Text style={styles.cardTitle}>Qtd. de Usuários</Text>
        <Text style={styles.cardContent}>50</Text>
      </View>
     </View>

     <View style={{ width: '36%' }}>
    <View style={styles.card}>

        <Icon
              as={MaterialIcons}
              name='kitchen'
              color='gray.200'
              size={6}
           />

        <Text style={styles.cardTitle}>Aniversariante</Text>
        <Text style={styles.cardContent}>5</Text>
    </View>
     </View>

     </ScrollView>
    </View>
     </View>

  


    <View style={styles.cardLista}>
        
      <VictoryChart  
        theme={VictoryTheme.material} >
        <VictoryBar
            height={10}
            width={10}
          data={[
            { x: 'Sag', y: 20 },
            { x: 'N.Fro', y: 30 },
            { x: 'Rib', y: 50 },
            { x: 'Acamp', y: 40 },
            { x: 'Bela.V', y: 60 },
            { x: 'Cent', y: 45 },
            { x: 'Bele', y: 55 },
            { x: 'Pano', y: 70 },
          ]}
        />
      </VictoryChart> 

    </View>

<View style={styles.cardLista}>
        
<VictoryChart
  theme={VictoryTheme.material}
  height={300}
  width={350}
>
  <VictoryLine
    style={{
      data: { stroke: "#c43a31" },
      parent: { border: "1px solid #ccc"}
    }}
    data={[      { x: "Jan", y: 50 },      { x: "Fev", y: 25 },      { x: "Mar", y: 100 },      { x: "Abr", y: 75 },      { x: "Mai", y: 125 },      { x: "Jun", y: 90 },      { x: "Jul", y: 150 },      { x: "Ago", y: 120 },      { x: "Set", y: 175 },      { x: "Out", y: 200 },      { x: "Nov", y: 250 },      { x: "Dez", y: 225 }    ]}
  />
</VictoryChart>


</View>
</>
)}


const styles = StyleSheet.create({
    cards: {
      // height:70,
      fontSize:8,
      padding: 0,
      shadowColor: '#000',
      marginVertical: 5,
      color:'#808080',    
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 5,
    },
  
    cardLista: {
      fontSize:8,
      backgroundColor: 'white',
      borderRadius: 8,
      margin:25,
      marginHorizontal: 15,
      borderWidth: 1,
      borderColor: '#dcdcdc', 
      color:'#808080',     
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
      },
      card: {
        width: '89%',
        height:'90%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        margin: 5,
        shadowColor: 'gray',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
      cardTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'gray',
      },
      cardContent: {
        
        fontSize: 25,
        fontWeight: 'bold',
        color: '#3f51b5',
      },

  });
