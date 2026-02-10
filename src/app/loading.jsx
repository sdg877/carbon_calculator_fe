export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      color: '#666'
    }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', fontWeight: '500' }}>Preparing your dashboard...</p>
    </div>
  );
}