import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Box, Card, Divider, Heading, HStack, Icon, Image, ScrollView, Text, useToast, View, VStack } from "native-base";
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { Loading } from "@components/Loading";
import { decode } from 'react-native-base64';
import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { Buffer } from 'buffer';
import FastImage from 'react-native-fast-image';
import axios from 'axios';




interface Member {
  id: number;
  nome_membro: string;
  email_dizimista: string;
  cidade: string;
  barrio: string;
  endereco: string;
  telefone: string;
  batismo_agua: string;
  data_nascimento: string;
  cargo: string;
  situacao: string;
  fk_igreja: number;
  data_batismo_espirito_santo: string | null;
  sexo: string;
  updated_at: string;
  created_at: string;
  igreja: {
    id: number;
    dirigente: string;
    nome_igreja: string;
    cidade: string;
    barrio: string;
    endereco: string;
  };
  tipo: {
    id: number;
    tipo: string;
  };
  image: string;
  fk_anexo : string;
}

interface ApiResponse {
  current_page: number;
  data: Member[];
}

type RouteParamsProps = {
  memberId: string;
}

export function MemberDetails() {

  const [membros, setMembros] = useState<Member>()
  const [anexo, setAnexo] = useState <string | undefined>(undefined);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()
  const route = useRoute()

  const { memberId } = route.params as RouteParamsProps

  function handleGoBack() {
    navigation.navigate('members')
  }

  
  
  const fetchExerciseDetails = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/api/membros/find/${memberId}`)
      setMembros(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Não foi possível carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }

  }

  async function getImage() {
    try {
      setIsLoading(true)
      const response = await api.get(`/api/membros/perfil/${memberId}`)
      setMembros(response.data)
      navigation.navigate('members')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Não foi possível carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onExcluirMembro(memberId: string) {
    try {
      setIsLoading(true)
      const response = await api.delete(`/api/membros/find/${memberId}`)
      
    } catch(error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Não foi possível carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally {
      setIsLoading(false)
      navigation.navigate('members');
    }


  }
  

  const fetchExerciseDetailsFoto = async () => {
    try {
      if (membros?.fk_anexo) {
          setIsImageLoading(true);
          const response = await api.get(`/api/membros/perfil/${membros.fk_anexo}`, {
          responseType: 'arraybuffer',
        });
          const base64Image = Buffer.from(response.data, 'binary').toString('base64');
  
          setAnexo(base64Image);

      } else {
        // Buscar imagem padrão e converter para base64
        const defaultImageUrl = 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png';
        const response = await axios.get(defaultImageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
  
        setAnexo(base64Image);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.mensagem
        : 'Não foi possível carregar os detalhes do exercício.';
  
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsImageLoading(false);
     
    }
  };
  

  useEffect(() => {
    async function fetchData() {
      await fetchExerciseDetails();
    }
  
    fetchData();
  }, [memberId]);
  
  useEffect(() => {
    if (membros) {
      fetchExerciseDetailsFoto();

    }
  }, [membros]);
  
  
  return(

    <VStack flex={1}>
      <VStack px={8} bg='gray.600' pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon
            as={Feather}
            name='arrow-left'
            color='green.500'
            size={6}
          />
        </TouchableOpacity>

        <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center'>
          <Heading color='gray.100' fontSize='lg' flexShrink={1} fontFamily='heading'>
            Informações de {membros?.nome_membro}
          </Heading>
        </HStack>
      </VStack>

      { isLoading ? <Loading /> : 
      
        <ScrollView>
          <VStack p={8}>

          
          <Card style={styles.card}>
          
              
            <VStack >  
              <VStack style={styles.cardText} >
                <View style={styles.cardTextFoto}>
                  
                  {
                    !isImageLoading && anexo ? (
                      <UserPhoto alt="Foto" size={10000} source={{ uri: `data:image/png;base64,${anexo}` }} style={[styles.foto, { marginRight: 8 }]} />
                    ) : (
                      <ActivityIndicator size="large" color="#0000ff" />
                    )
                  }
                  <Text style={styles.textCardeDaFotoNome}>{membros?.nome_membro}</Text>
                </View>
            </VStack>
                        
          

            <View style={styles.cardText}>
              <Text style={styles.texto}>ID:</Text>
              <Text style={styles.textoMembro}>{membros?.id}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Email:</Text>
              <Text style={styles.textoMembro}>{membros?.email_dizimista}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Cidade:</Text>
              <Text style={styles.textoMembro}>{membros?.cidade}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Bairro:</Text>
              <Text style={styles.textoMembro}>{membros?.barrio}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Endereço:</Text>
              <Text style={styles.textoMembro}>{membros?.endereco}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Telefone:</Text>
              <Text style={styles.textoMembro}>{membros?.telefone}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Batismo nas águas:</Text>
              <Text style={styles.textoMembro}>{membros?.batismo_agua}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Data de nascimento:</Text>
              <Text style={styles.textoMembro}>{membros?.data_nascimento}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Situação:</Text>
              <Text style={styles.textoMembro}>{membros?.situacao}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Igreja:</Text>
              <Text style={styles.textoMembro}>{membros?.igreja?.nome_igreja}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Tipo:</Text>
              <Text style={styles.textoMembro}>{membros?.tipo?.tipo}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Data de batismo no Espírito Santo:</Text>
              <Text style={styles.textoMembro}>{membros?.data_batismo_espirito_santo || '-'}</Text>
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Sexo:</Text>
              <Text style={styles.textoMembro}>{membros?.sexo}</Text>
            </View>
                
            </VStack>
          </Card>
 
      <Button title="Excluir membro" h={12} onPress={() => onExcluirMembro(memberId)} />
          </VStack>
        </ScrollView>
      }
    </VStack>
  )
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
  }
  
});
