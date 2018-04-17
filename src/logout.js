import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from './services';
import { outlogged } from './app';

export function logout() {
	userService.signOut();
	outlogged();
}










