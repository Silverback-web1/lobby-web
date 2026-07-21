'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { connectSocket, joinMatch, leaveMatch } from '../../../../lib/socket';
import { Avatar } from '../../../../components/ui';
import { SafetyMenu } from '../../../../components/SafetyMenu';
import styles from './chat.module.css';

interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface OtherUser { id: string; username: string }
interface MatchDetail { id: string; other_user: OtherUser | null }

export default function ChatPage() {
  const { id: matchId } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<MatchDetail>(`/matches/${matchId}`).then((m) => setOtherUser(m.other_user)).catch(() => {});

    api.get<Message[]>(`/messages/${matchId}`)
      .then(setMessages)
      .finally(() => setLoading(false));

    const socket = connectSocket();
    joinMatch(matchId);
    const onNew = (msg: Message) => {
      if (msg.match_id === matchId) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    };
    socket.on('message:new', onNew);

    return () => {
      leaveMatch(matchId);
      socket.off('message:new', onNew);
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      await api.post(`/messages/${matchId}`, { content });
    } catch {
      setText(content);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p className={styles.status}>Loading…</p>;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Avatar username={otherUser?.username ?? '?'} size={32} />
        <strong className={styles.headerName}>{otherUser?.username ?? 'Match'}</strong>
        {otherUser && (
          <SafetyMenu
            userId={otherUser.id}
            username={otherUser.username}
            onBlocked={() => router.push('/app/matches')}
          />
        )}
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <p className={styles.empty}>👋 Say hi and figure out where to squad up.</p>
        )}
        {messages.map((m) => {
          const isMe = m.sender_id === user?.id;
          return (
            <div key={m.id} className={styles.msgRow} data-mine={isMe}>
              <div className={styles.bubble} data-mine={isMe}>
                <p className={styles.bubbleText}>{m.content}</p>
                <span className={styles.time}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className={styles.inputRow} onSubmit={sendMessage}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit" className={styles.sendBtn} disabled={!text.trim() || sending}>↑</button>
      </form>
    </div>
  );
}
