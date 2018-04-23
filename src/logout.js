import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from './components/Services/UserService';
import { outlogged } from './app';
//funksjon for å cleare localstorage
export function logout() {
	userService.signOut();
	outlogged();
}
