
import { ScreenHeader } from "@components/ScreenHeader";
import { RefreshControl,StyleSheet, ActivityIndicator} from 'react-native'
import {  VStack, Text, FlatList, View, Card, ScrollView, Heading, HStack } from "native-base";

import { Input } from '@components/Input';
import { DashboardIdicadores } from "@components/Dash";
import { useEffect, useState } from "react";
// import { ApiResponse } from "./Home";
import { api } from "@services/api";

export interface ApiResponse {
  Membros: number;
  status_code: number;
}

export function Dashboard() {


  const [membros, setMembros] = useState<ApiResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);


  const fetchMembrosQunatidade = async () => {
    
    try {
      setIsLoading(true);
      const response = await api.get(`/api/membros/all/count`);
      const data = await response.data;
      setMembros(data);
      setHasMore(false);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      setHasMore(true);
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    setRefresh(true);
    await fetchMembrosQunatidade();
    setRefresh(false);
  };

  useEffect(() => {
  
    fetchMembrosQunatidade();

 }, []);

    console.log("-->> logg" , membros);

  return (
  
     <VStack flex={1} margin={0} >
        
      <ScreenHeader title='Indicadores' />

        <HStack justifyContent='space-between' >
          <Heading color='gray.200' fontSize='md'  margin={1} padding={3} fontFamily='heading'>
            Indicadores Assembleia
          </Heading>
        </HStack>

        <ScrollView>
             <View style={styles.card}>
             <DashboardIdicadores membros={membros} />
            </View>
         </ScrollView>
     </VStack>
  
        )
        
        }



        const styles = StyleSheet.create({
          card: {
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
            margin:58,
            marginVertical: 2,
            marginHorizontal: 29,
            borderWidth: 1,
            borderColor: '#dcdcdc', 
            color:'#808080',     
          },
        });


        
