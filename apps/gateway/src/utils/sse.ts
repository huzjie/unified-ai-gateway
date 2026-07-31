/** SSE 帧辅助 */
export function sseFrame(data: string): string {
  return `data: ${data}\n\n`;
}

export function sseDone(): string {
  return 'data: [DONE]\n\n';
}
