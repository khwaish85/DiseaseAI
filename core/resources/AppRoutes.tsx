import SplashScreen from '../../screens/SplashScreen';
import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../../screens/HomeScreen';
import PredictScreen from '../../screens/PredictForm';

export const AppRoutes = {
  splash: 'Splash',
  login: 'Login',
  home: 'Home',
  predict: 'Predict',
};

export const routeComponents = {
  [AppRoutes.splash]: SplashScreen,
  [AppRoutes.login]: LoginScreen,
  [AppRoutes.home]: HomeScreen,
  [AppRoutes.predict]: PredictScreen,
};
