import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from './services';
import { outlogged } from './app';
//funksjon for å cleare localstorage
export function logout() {
	userService.signOut();
	outlogged();
}
