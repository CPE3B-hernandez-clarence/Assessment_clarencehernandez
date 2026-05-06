import { SupportFormPanel } from './components/SupportFormPanel';
import { SupportPreview } from './components/SupportPreview';
import { useSupportForm } from './hooks/useSupportForm';
import './App.css';

function App() {
  const supportForm = useSupportForm();

  return (
    <main className="support-page">
      <section className="support-shell" aria-labelledby="support-title">
        <SupportFormPanel {...supportForm} />
        <SupportPreview preview={supportForm.preview} />
      </section>
    </main>
  );
}

export default App;
