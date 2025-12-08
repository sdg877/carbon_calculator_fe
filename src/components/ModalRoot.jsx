"use client";
import { useEffect, useState } from "react";

export default function ModalRoot() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div id="modal-root" />;
}
