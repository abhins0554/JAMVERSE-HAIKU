import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: value provided is not in a recognized RFC2822 or ISO format']); // Ignore log notification by message
LogBox.ignoreAllLogs();