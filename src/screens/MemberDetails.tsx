import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Box, Card, Divider, Heading, HStack, Icon, Image, Modal, ScrollView, Text, useToast, View, VStack } from "native-base";
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { Loading } from "@components/Loading";
import { decode } from 'react-native-base64';
import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { Buffer } from 'buffer';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'
import Popover from 'react-native-popover-view';
import { EditPopover } from "@components/EditPopover";

type FormData = {
  nome_membro: string;
  email_dizimista: string;
  cidade: string;
  barrio: string;
  endereco: string;
  telefone: string;
  batismo_agua: string;
  data_nascimento: string;
  cargo: string;
  situacao: number;
  fk_igreja: number;
  data_batismo_espirito_santo: string;
  sexo: string;
}



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
  const [modalVisible, setModalVisible] = useState(false);
  const [novoEmail, setNovoEmail] = useState('');
  const [nome, setNome] = useState('');

  const [popoverVisible, setPopoverVisible] = useState(false);


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

  const handleUpdate = async (novoEmail:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'email_dizimista' : novoEmail,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateNome = async (nome:string) => { 

    try {
      setIsLoading(true)

      //const base64Photo = await FileSystem.readAsStringAsync(userPhoto, { encoding: FileSystem.EncodingType.Base64 });

      console.log(novoEmail);

      const res = await api.put(`/api/membros/find/${memberId}`, {
        'nome_membro' : nome,
      })

      fetchExerciseDetails();
    
      const message = "Membro cadastrado com sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Não foi possível cadastrat o membro. Tente novamente mais tarde.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateCidade = async (novoCidade:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'cidade' : novoCidade,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateBairro = async (barrio:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'barrio' : barrio,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateEndereco = async (endereco:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'endereco' : endereco,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateTelefone = async (telefone:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'telefone' : telefone,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateBatismo_agua = async (batismo_agua:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'batismo_agua' : batismo_agua,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateData_nascimento = async (data_nascimento:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'data_nascimento' : data_nascimento,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  // const handleUpdateCargo = async (cargo:string) => { 

  //   try {
  //     setIsLoading(true)
  //     const res = await api.put(`/api/membros/find/${memberId}`, {
  //       'cargo' : cargo,
  //     })

  //     fetchExerciseDetails();
    
  //     const message = "sucesso!";
  //     toast.show({
  //       title: message,
  //       bgColor: 'green.800',
  //       placement: 'top',
  //       duration: 9000,
  //     });
  
  //     setIsLoading(false)
    

  //   } catch(error) {
  //     setIsLoading(false)

  //     const isAppError = error instanceof AppError
  //     const title = isAppError ? error.mensagem : 'Erro.'
      
  //     toast.show({
  //       title,
  //       placement: 'top',
  //       bgColor: 'red.500'
  //     })
  //   }
  // }

  const handleUpdatesituacao = async (situacao:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'situacao' : situacao,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdatdata_batismo_espirito_santo = async (data_batismo_espirito_santo:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'data_batismo_espirito_santo' : data_batismo_espirito_santo,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const handleUpdateSexo = async (sexo:string) => { 

    try {
      setIsLoading(true)
      const res = await api.put(`/api/membros/find/${memberId}`, {
        'sexo' : sexo,
      })

      fetchExerciseDetails();
    
      const message = "sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
  
      setIsLoading(false)
    

    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Erro.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

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
                  <EditPopover
                    label='Nome'
                    value={membros?.nome_membro || ''} 
                    onSave={handleUpdateNome}
              />
                </View>
            </VStack>
                        
          

            <View style={styles.cardText}>
              <Text style={styles.texto}>ID:</Text>
              <Text style={styles.textoMembro}>{membros?.id}</Text>
            </View>

            <View>
            <View style={styles.cardText}>
              <Text style={styles.texto}>Email:</Text>

              <EditPopover
                label='E-mail'
                value={membros?.email_dizimista || ''} 
                onSave={handleUpdate}
              />
              <Text style={styles.textoMembro}>{membros?.email_dizimista}</Text>
            </View>  
                      
          </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Cidade:</Text>
              <Text style={styles.textoMembro}>{membros?.cidade}</Text>
              <EditPopover
                    label='Cidade'
                    value={membros?.cidade || ''} 
                    onSave={handleUpdateCidade}
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Bairro:</Text>
              <Text style={styles.textoMembro}>{membros?.barrio}</Text>
              <EditPopover
                    label='barrio'
                    value={membros?.barrio || ''} 
                    onSave={handleUpdateBairro}
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Endereço:</Text>
              <Text style={styles.textoMembro}>{membros?.endereco}</Text>
              <EditPopover
                    label='Endereço'
                    value={membros?.endereco || ''} 
                    onSave={handleUpdateEndereco}
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Telefone:</Text>
              <Text style={styles.textoMembro}>{membros?.telefone}</Text>
              <EditPopover
                    label='Telefone'
                    value={membros?.telefone || ''} 
                    onSave={handleUpdateTelefone}
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Batismo nas águas:</Text>
              <Text style={styles.textoMembro}>{membros?.batismo_agua}</Text>
              <EditPopover
                    label='Batismo nas agua'
                    value={membros?.batismo_agua || ''} 
                    onSave={handleUpdateBatismo_agua}
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Data de nascimento:</Text>
              <Text style={styles.textoMembro}>{membros?.data_nascimento}</Text>
              <EditPopover
                    label='Data bacimento'
                    value={membros?.data_nascimento || ''} 
                    onSave={handleUpdateData_nascimento}
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Situação:</Text>
              <Text style={styles.textoMembro}>{membros?.situacao}</Text>
              <EditPopover
                    label='Situação'
                    value={membros?.situacao || ''} 
                    onSave={handleUpdatesituacao}
              />
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
              <EditPopover
                    label='Data de batismo no Espírito Santo'
                    value={membros?.data_batismo_espirito_santo || ''} 
                    onSave={handleUpdatdata_batismo_espirito_santo}
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.texto}>Sexo:</Text>
              <Text style={styles.textoMembro}>{membros?.sexo}</Text>
              <EditPopover
                    label='Data de batismo no Espírito Santo'
                    value={membros?.sexo || ''} 
                    onSave={handleUpdateSexo}
              />
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
