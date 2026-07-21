'use client';

import React from 'react';
import styles from './ui.module.css';

// ─── Button ──────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={styles.btn}
      data-variant={variant}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, ...rest }: InputProps) {
  return (
    <label className={styles.inputWrap}>
      {label && <span className={styles.inputLabel}>{label}</span>}
      <input className={styles.input} {...rest} />
    </label>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, ...rest }: TextareaProps) {
  return (
    <label className={styles.inputWrap}>
      {label && <span className={styles.inputLabel}>{label}</span>}
      <textarea className={styles.textarea} {...rest} />
    </label>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────

export function Card({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.card} ${className ?? ''}`} {...rest}>
      {children}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  color?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ label, color = 'neutral' }: BadgeProps) {
  return (
    <span className={styles.badge} data-color={color}>
      {label}
    </span>
  );
}

export function SkillBadge({ level }: { level: number }) {
  const label = level <= 3 ? 'Beginner' : level <= 6 ? 'Intermediate' : level <= 8 ? 'Advanced' : 'Elite';
  const color = level <= 3 ? 'success' : level <= 6 ? 'brand' : level <= 8 ? 'warning' : 'danger';
  return <Badge label={`${label} · ${level}/10`} color={color} />;
}

// ─── Avatar ──────────────────────────────────────────────────────────────

export function Avatar({ username, size = 40 }: { username: string; size?: number }) {
  return (
    <div className={styles.avatar} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {username.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────

export function EmptyState({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>{icon}</span>
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyBody}>{body}</p>
    </div>
  );
}
