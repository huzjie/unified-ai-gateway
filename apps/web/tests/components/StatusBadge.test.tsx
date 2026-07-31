import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../src/components/Common/StatusBadge';

describe('StatusBadge', () => {
  it('渲染健康状态', () => {
    render(<StatusBadge status="healthy" />);
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });

  it('渲染错误状态', () => {
    render(<StatusBadge status="unhealthy" />);
    expect(screen.getByText('unhealthy')).toBeInTheDocument();
  });
});
