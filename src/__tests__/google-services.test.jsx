import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PollingMap from '../components/Map/PollingMap';
import DocumentVault from '../components/Storage/DocumentVault';
import VoterInfo from '../components/Civic/VoterInfo';
import { LanguageProvider } from '../context/LanguageContext';

// Mock dependencies
vi.mock('@/lib/googleMaps', () => ({
  initGoogleMaps: vi.fn(() => Promise.resolve({
    Map: vi.fn(),
    Marker: vi.fn()
  }))
}));

describe('Google Services Components', () => {
  it('renders PollingMap component', () => {
    render(
      <LanguageProvider>
        <PollingMap />
      </LanguageProvider>
    );
    expect(screen.getByText(/Polling Station Locator/i) || screen.getByText(/मतदान केंद्र खोजक/i)).toBeDefined();
  });

  it('renders DocumentVault and simulates upload', async () => {
    render(<DocumentVault />);
    const uploadArea = screen.getByText(/Click to Upload/i);
    expect(uploadArea).toBeDefined();
    
    const input = screen.getByLabelText(/Upload document/i);
    fireEvent.change(input, { target: { files: [new File([''], 'test.pdf')] } });
    // Simulation starts
    expect(screen.getByText(/Encrypting and Uploading/i)).toBeDefined();
    
    await waitFor(() => {
      expect(screen.getByText(/Document Secured in Encrypted Vault/i)).toBeDefined();
    }, { timeout: 3000 });
  });

  it('renders VoterInfo and simulates search', async () => {
    render(<VoterInfo />);
    const input = screen.getByPlaceholderText(/Enter your Zip Code or City/i);
    const button = screen.getByText(/Find My Representatives/i);
    
    fireEvent.change(input, { target: { value: '110001' } });
    fireEvent.click(button);
    
    expect(screen.getByText(/Searching Civic API/i)).toBeDefined();
    
    await waitFor(() => {
      expect(screen.getByText(/General Election 2026/i)).toBeDefined();
      expect(screen.getByText(/Kendriya Vidyalaya, New Delhi/i)).toBeDefined();
    }, { timeout: 3500 });
  });

  it('handles empty search input gracefully', () => {
    render(<VoterInfo />);
    const button = screen.getByText(/Find My Representatives/i);
    fireEvent.click(button);
    expect(screen.queryByText(/Searching Civic API/i)).toBeNull();
  });

  it('renders DocumentVault and simulates upload failure', async () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.9; // Force failure
    global.Math = mockMath;

    render(<DocumentVault />);
    const input = screen.getByLabelText(/Upload document/i);
    fireEvent.change(input, { target: { files: [new File([''], 'test.pdf')] } });
    
    await waitFor(() => {
      expect(screen.queryByText(/Encrypting and Uploading/i)).toBeNull();
    }, { timeout: 3000 });
  });
});
