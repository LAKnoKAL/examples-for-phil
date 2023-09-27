import { useState } from 'react';

import type { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Button } from 'components/_shared';
import { MainLayout } from 'components/layouts';
import NavBar from 'components/navbar';
import { ExtendedNextPage } from 'types/next-page';

enum FrequenciesEnum {
  Regularly = 'Regularly',
  EveryOtherMonth = 'EveryOtherMonth',
  Seasonally = 'Seasonally',
}

const FREQUENCIES = [
  {
    title: 'Regularly',
    description: 'Every month (most popular)',
    value: FrequenciesEnum.Regularly,
  },
  {
    title: 'Every Other Month',
    description: 'Every 2 months',
    value: FrequenciesEnum.EveryOtherMonth,
  },
  {
    title: 'Seasonally',
    description: 'Every 3 months',
    value: FrequenciesEnum.Seasonally,
  },
] as const;

const OnboardingFrequency: ExtendedNextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  // TODO: set default/selected one from API
  const [frequency, setFrequency] = useState<FrequenciesEnum>();

  const handleToggleFrequency = (frequencyToSet: FrequenciesEnum) => {
    setFrequency(frequencyToSet);
    router.push('/onboarding/date');
  };

  return (
    <>
      <Head>
        <title>{t('onboarding.frequency.headTitle')} | Keesh</title>
      </Head>

      <NavBar />

      <div className="mt-8 mb-6 px-5 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="mb-2 text-3xl font-semibold font-poppins">
          {t('onboarding.frequency.title')}
        </div>

        <Trans i18nKey="onboarding.frequency.description">
          <p className="mb-1 leading-5 text-black/70">
            Select how often you would like to receive your Keesh Kit.
          </p>
          <p className="leading-5 text-black/70">
            No subscription required, you have the flexibility to change or
            cancel anytime via your profile.
          </p>
        </Trans>
      </div>

      {/* TODO: move into separate component */}
      <div className="px-4 w-full sm:max-w-lg sm:mx-auto">
        {FREQUENCIES.map(fr => (
          <Button
            key={fr.value}
            size="sm"
            fullWidth
            color="light"
            className={`mb-7 !border-[2px] bg-white font-poppins ${
              fr.value === frequency ? '!border-black' : ''
            }`}
            onClick={() => handleToggleFrequency(fr.value)}
          >
            <>
              <span className="text-xl">{fr.title}</span>
              <br />
              <span className="text-sm font-light">{fr.description}</span>
            </>
          </Button>
        ))}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

OnboardingFrequency.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default OnboardingFrequency;
