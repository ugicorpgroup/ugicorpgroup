const defaultNumber = "+1 (647) 213-2228";

export default function WhatsAppLink({ number }) {
  const digits = String(number || defaultNumber).replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with US GLOBAL IMPEX on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 3.5a12.5 12.5 0 0 0-10.7 19L3.5 29l6.7-1.8A12.5 12.5 0 1 0 16 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m11.2 9.4 2 4.3-1.4 1.6c1.1 2.3 2.9 4.1 5.2 5.2l1.6-1.4 4.3 2c-.2 2.1-1.9 3.1-3.6 2.6-5.6-1.6-9.8-5.8-11.4-11.4-.5-1.7.5-3.4 2.6-3.6l.7.7Z" fill="currentColor" />
      </svg>
    </a>
  );
}
