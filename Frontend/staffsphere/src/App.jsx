import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* ... existing routes ... */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App; 