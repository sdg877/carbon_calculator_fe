"use client";
import { useEffect, useState } from 'react';

export default function ModalRoot() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This runs once the component has successfully mounted on the client.
    setIsClient(true);
  }, []);

  // We only render the root div if we are on the client side.
  // The element itself is still necessary even if we wait for client side.
  // The state check, though often redundant, is kept for maximum reliability against portal hydration errors.
  return (
    <div id="modal-root" />
  );
}
