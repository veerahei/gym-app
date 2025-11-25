import { Image } from 'react-native'

export default function LogoTitle() {
    return (
      <Image
        source={require('../assets/FullLogo_Transparent_NoBuffer.png')}
        style={{ width: 40, height: 40 }}
      />
    )
  }