import { createContext } from 'react';
import { AuthContextType } from './authTypes';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
