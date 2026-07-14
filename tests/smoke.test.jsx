import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('smoke', () => {
  it('renders a React element and finds its text', () => {
    render(<div>PIT test pipeline online</div>);
    expect(screen.getByText('PIT test pipeline online')).toBeInTheDocument();
  });
});
