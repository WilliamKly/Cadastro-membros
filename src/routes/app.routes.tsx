import { Platform,StyleSheet } from 'react-native'
import { Icon, useTheme } from 'native-base'
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import { Members } from '@screens/Members'
import { Home } from '@screens/Home'
import { MemberDetails } from '@screens/MemberDetails'
import { Dashboard } from '@screens/Dashboard'
import { MaterialIcons } from '@expo/vector-icons'




type AppRoutes = {
  home: undefined;
  memberDetails: {memberId: string};
  profile: undefined;
  members: undefined;
  dashboard :undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {

  const { sizes, colors } = useTheme()

  const iconSize = sizes[6]

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.green[500],
      tabBarInactiveTintColor: colors.gray[200],
      tabBarStyle: {
        backgroundColor: colors.gray[600],
        borderTopWidth: 0,
        height: Platform.OS === 'android' ? 'auto' : 96,
        paddingBottom: sizes[10],
        paddingTop: sizes[6]
      }
    }}>

    
      
      <Screen
        name='home'
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />

      <Screen
        
        name='dashboard'
        component={Dashboard}
        options={{
          tabBarIcon: ({ color }) => (
           <Icon
              fill={color} 
              width={iconSize} 
              height={iconSize}
              as={MaterialIcons}
              name='dashboard'
              color='gray.200'
              size={6}
           />
          )
        }}
      />

      <Screen
        name='members'
        component={Members}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />
      <Screen
        name='memberDetails'
        component={MemberDetails}
        options={{ tabBarButton: () => null }}
      />
    
    </Navigator>
  )
}


const styles = StyleSheet.create({
 
});
