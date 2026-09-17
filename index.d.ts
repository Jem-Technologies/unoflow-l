export interface LogoItem {
  name: string;
  category: string;
  source: 'favicon' | 'unavatar';
  url: string;
  faviconUrl: string;
  unavatarUrl: string;
  hasImage: boolean;
  status: string;
  updatedAt: number;
}

export interface LogoOptions {
  variant?: 'favicon' | 'unavatar';
  fallback?: string;
}

export interface LogosConfig {
  baseUrl?: string;
  ttlMs?: number;
}

export interface LogosEngine {
  init(config?: LogosConfig): Promise<Record<string, LogoItem> | null>;
  config(config?: LogosConfig): LogosConfig;
  get(key: string, opts?: LogoOptions): string;
  has(key: string): boolean;
  hasImage(key: string): boolean;
  apply(imgEl: HTMLElement | null, key: string, opts?: LogoOptions): void;
  source(): string;
  refresh(force?: boolean): Promise<Record<string, LogoItem> | null>;
  readonly ready: Promise<Record<string, LogoItem> | null>;
  readonly GENERIC: string;
}

declare const Logos: LogosEngine;

export default Logos;
