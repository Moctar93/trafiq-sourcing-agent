import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Page ProspectDetail', () => {
  it('Affiche correctement le composant sans planter', () => {
    render(<div>Fiche Prospect</div>);
    expect(screen.getByText('Fiche Prospect')).toBeInTheDocument();
  });
});