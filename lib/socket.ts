import { io, Socket } from 'socket.io-client';
import { BASE_API_URL } from './api';

let socket: Socket | null = null;

export function connectSocket(): Socket {
  if (socket?.connected) return socket;
  const token = localStorage.getItem('auth_token');
  socket = io(BASE_API_URL, { auth: { token } });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function joinMatch(matchId: string) {
  socket?.emit('match:join', matchId);
}

export function leaveMatch(matchId: string) {
  socket?.emit('match:leave', matchId);
}
