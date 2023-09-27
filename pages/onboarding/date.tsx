import { Ref, useState, forwardRef } from 'react';

import { format } from 'date-fns';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';

import { Button } from 'components/_shared';
import { MainLayout } from 'components/layouts';
import NavBar from 'components/navbar';
import { ExtendedNextPage } from 'types/next-page';

interface Props {
  value?: string | number | Date;
  onClick?: () => void;
}

const ButtonCustomInput = forwardRef(
  ({ value, onClick }: Props, ref: Ref<HTMLButtonElement>) => (
    <Button
      ref={ref}
      size="xl"
      fullWidth
      color="light"
      className="bg-white font-bold underline"
      onClick={onClick}
    >
      {format(new Date(value || ''), 'PPPP')}
    </Button>
  )
);

ButtonCustomInput.displayName = 'ButtonCustomInput';

const OnboardingDate: ExtendedNextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  // TODO: set default date one from API
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const handleConfirmDate = () => {
    router.push('/checkout/address');
  };

  return (
    <>
      <Head>
        <title>{t('onboarding.date.headTitle')} | Keesh</title>
      </Head>

      <NavBar />

      <div className="mt-8 mb-6 px-5 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="mb-2 text-3xl font-semibold font-poppins">
          {t('onboarding.date.title')}
        </div>

        <p className="mb-1 leading-5 text-black/70">
          {t('onboarding.date.description')}
        </p>
      </div>

      <div className="px-4 w-full sm:max-w-lg sm:mx-auto">
        <p className="mb-2 leading-5 text-[12px] text-center text-black/70">
          {t('onboarding.date.arrivalTitle')}
        </p>

        <DatePicker
          calendarClassName="!rounded-b-[10px] !rounded-t-none !border-gray-300"
          showPopperArrow={false}
          // withPortal
          wrapperClassName="w-full mb-4"
          selected={new Date(arrivalDate)} // Convert arrivalDate back to Date type
          minDate={new Date()}
          filterDate={isWeekday}
          // highlightDates={[subDays(new Date(), 7), addDays(new Date(), 7)]}
          onChange={(date: Date) => setArrivalDate(date)} // Specify Date type for date argument
          customInput={<ButtonCustomInput />}
          popperClassName="w-full flex items-center justify-center px-4"
          popperModifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, -11],
              },
            },
          ]}
        />

        <p className="mb-10 px-6 leading-[15px] text-[12px] text-center text-black/70">
          {t('onboarding.date.arrivalDescription')}
        </p>

        <Button fullWidth size="lg" type="submit" onClick={handleConfirmDate}>
          {t('onboarding.date.action')}
        </Button>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

OnboardingDate.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default OnboardingDate;
