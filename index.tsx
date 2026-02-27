
import App from './App';

console.log('🚀 App entry point initialized...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
console.log('📦 Root created, starting render...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log('✨ Render call completed.');
