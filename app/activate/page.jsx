import { Suspense } from 'react';
import ActivateClient from './client';

export default function ActivatePage() {
  return (
    <Suspense fallback={<p className="text-center p-4">Activating your account...</p>}>
      <ActivateClient />
    </Suspense>
  );
}
