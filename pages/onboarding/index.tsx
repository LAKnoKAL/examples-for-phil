import { useEffect } from 'react';

import { useRouter } from 'next/router';

export default function Onboarding() {
  const router = useRouter();

  // TODO: Add logic to check where exactly redirect user based on his onboarding status/progress
  useEffect(() => {
    router.push('/onboarding/frequency');
  });

  return <></>;
}
