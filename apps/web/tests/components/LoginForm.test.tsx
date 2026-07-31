import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../src/components/Auth/LoginForm';

// 简化测试：不依赖真实 store 网络
jest.mock('../src/store/auth-store', () => ({
  useAuthStore: () => ({
    login: jest.fn().mockResolvedValue(undefined),
    token: null,
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('LoginForm', () => {
  it('渲染登录表单', () => {
    render(<LoginForm />);
    expect(screen.getByText('登 录')).toBeInTheDocument();
    expect(screen.getByLabelText('用户名/邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
  });

  it('空表单禁用登录按钮', () => {
    render(<LoginForm />);
    const button = screen.getByText('登 录');
    expect(button).toBeDisabled();
  });
});
