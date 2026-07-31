import { render, screen } from '@testing-library/react';
import { StatCard } from '../src/components/Common/StatCard';

describe('StatCard', () => {
  it('渲染标题与数值', () => {
    render(<StatCard title="今日调用量" value="128,430" sub="+12%" />);
    expect(screen.getByText('今日调用量')).toBeInTheDocument();
    expect(screen.getByText('128,430')).toBeInTheDocument();
  });
});
