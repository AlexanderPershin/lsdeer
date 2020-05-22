import { createGlobalStyle } from 'styled-components';

// Roboto
import RobotoBlack from '../fonts/Roboto/Roboto-Black.ttf';
import RobotoBlackItalic from '../fonts/Roboto/Roboto-BlackItalic.ttf';
import RobotoBold from '../fonts/Roboto/Roboto-Bold.ttf';
import RobotoBoldItalic from '../fonts/Roboto/Roboto-BoldItalic.ttf';
import RobotoItalic from '../fonts/Roboto/Roboto-Italic.ttf';
import RobotoLight from '../fonts/Roboto/Roboto-Light.ttf';
import RobotoLightItalic from '../fonts/Roboto/Roboto-LightItalic.ttf';
import RobotoMedium from '../fonts/Roboto/Roboto-Medium.ttf';
import RobotoMediumItalic from '../fonts/Roboto/Roboto-MediumItalic.ttf';
import RobotoRegular from '../fonts/Roboto/Roboto-Regular.ttf';
import RobotoThin from '../fonts/Roboto/Roboto-Thin.ttf';
import RobotoThinItalic from '../fonts/Roboto/Roboto-ThinItalic.ttf';

// Raleway
import RalewayBlack from '../fonts/Raleway/Raleway-Black.ttf';
import RalewayBlackItalic from '../fonts/Raleway/Raleway-BlackItalic.ttf';
import RalewayBold from '../fonts/Raleway/Raleway-Bold.ttf';
import RalewayBoldItalic from '../fonts/Raleway/Raleway-BoldItalic.ttf';
import RalewayItalic from '../fonts/Raleway/Raleway-Italic.ttf';
import RalewayLight from '../fonts/Raleway/Raleway-Light.ttf';
import RalewayLightItalic from '../fonts/Raleway/Raleway-LightItalic.ttf';
import RalewayMedium from '../fonts/Raleway/Raleway-Medium.ttf';
import RalewayMediumItalic from '../fonts/Raleway/Raleway-MediumItalic.ttf';
import RalewayRegular from '../fonts/Raleway/Raleway-Regular.ttf';
import RalewayThin from '../fonts/Raleway/Raleway-Thin.ttf';
import RalewayThinItalic from '../fonts/Raleway/Raleway-ThinItalic.ttf';

// Lato
import LatoBlack from '../fonts/Lato/Lato-Black.ttf';
import LatoBlackItalic from '../fonts/Lato/Lato-BlackItalic.ttf';
import LatoBold from '../fonts/Lato/Lato-Bold.ttf';
import LatoBoldItalic from '../fonts/Lato/Lato-BoldItalic.ttf';
import LatoItalic from '../fonts/Lato/Lato-Italic.ttf';
import LatoLight from '../fonts/Lato/Lato-Light.ttf';
import LatoLightItalic from '../fonts/Lato/Lato-LightItalic.ttf';
import LatoRegular from '../fonts/Lato/Lato-Regular.ttf';
import LatoThin from '../fonts/Lato/Lato-Thin.ttf';
import LatoThinItalic from '../fonts/Lato/Lato-ThinItalic.ttf';

const GlobalStyle = createGlobalStyle`
  *,*::before,*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html {
    overflow: hidden;
    user-select: none;
  }
  :root {
    font-size: ${({ theme }) => theme.font.appFontSize}px;
  }
  body {
    background-color: #fff;
    font-family: ${({ theme }) => theme.font.appFontFamily};
    background-color: ${({ theme }) => theme.bg.appBg};
    overflow: hidden;
  }
  @font-face {
    font-family: 'Roboto';
    src: local('Roboto-Black'), local('Roboto-BlackItalic), local('Roboto-Bold), local('Roboto-BoldItalic), local('Roboto-Light), local('Roboto-LightItalic), local('Roboto-Medium), local('Roboto-MediumItalic), local('Roboto-Regular), local('Roboto-Thin), local('Roboto-ThinItalic),
    url(${RobotoBlack}) format('ttf'),
    url(${RobotoBlackItalic}) format('ttf'),
    url(${RobotoBold}) format('ttf'),
    url(${RobotoBoldItalic}) format('ttf'),
    url(${RobotoItalic}) format('ttf'),
    url(${RobotoLight}) format('ttf'),
    url(${RobotoLightItalic}) format('ttf'),
    url(${RobotoMedium}) format('ttf'),
    url(${RobotoMediumItalic}) format('ttf'),
    url(${RobotoRegular}) format('ttf'),
    url(${RobotoThin}) format('ttf'),
    url(${RobotoThinItalic}) format('ttf');
    font-weight: 300;
    font-style: normal;
}

@font-face {
  font-family: 'Raleway';
  src: local('Raleway-Black'), local('Raleway-BlackItalic), local('Raleway-Bold), local('Raleway-BoldItalic), local('Raleway-Light), local('Raleway-LightItalic), local('Raleway-Medium), local('Raleway-MediumItalic), local('Raleway-Regular), local('Raleway-Thin), local('Raleway-ThinItalic),
  url(${RalewayBlack}) format('ttf'),
  url(${RalewayBlackItalic}) format('ttf'),
  url(${RalewayBold}) format('ttf'),
  url(${RalewayBoldItalic}) format('ttf'),
  url(${RalewayItalic}) format('ttf'),
  url(${RalewayLight}) format('ttf'),
  url(${RalewayLightItalic}) format('ttf'),
  url(${RalewayMedium}) format('ttf'),
  url(${RalewayMediumItalic}) format('ttf'),
  url(${RalewayRegular}) format('ttf'),
  url(${RalewayThin}) format('ttf'),
  url(${RalewayThinItalic}) format('ttf');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Lato';
  src: local('Lato-Black'), local('Lato-BlackItalic), local('Lato-Bold), local('Lato-BoldItalic), local('Lato-Light), local('Lato-LightItalic), local('Lato-Regular), local('Lato-Thin), local('Lato-ThinItalic),
  url(${LatoBlack}) format('ttf'),
  url(${LatoBlackItalic}) format('ttf'),
  url(${LatoBold}) format('ttf'),
  url(${LatoBoldItalic}) format('ttf'),
  url(${LatoItalic}) format('ttf'),
  url(${LatoLight}) format('ttf'),
  url(${LatoLightItalic}) format('ttf'),
  url(${LatoRegular}) format('ttf'),
  url(${LatoThin}) format('ttf'),
  url(${LatoThinItalic}) format('ttf');
  font-weight: 300;
  font-style: normal;
}
`;

export default GlobalStyle;
