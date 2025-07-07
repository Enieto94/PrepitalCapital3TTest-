// ProductList.test.ts
import { render, screen } from '@testing-library/svelte';
import ProductList from './ProductList.svelte';

test('renders loading state', () => {
    render(ProductList);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
});