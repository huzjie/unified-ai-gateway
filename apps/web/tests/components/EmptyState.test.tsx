import { render, screen } from '@testing-library/react';
import { EmptyState } from '../src/components/Common/EmptyState';

describe('EmptyState', () => {
  it('渲染默认消息', () => {
    render(<EmptyState />);
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('渲染自定义消息', () => {
    render(<EmptyState message="没有 Provider" />);
    expect(screen.getByText('没有 Provider')).toBeInTheDocument();
  });
});
