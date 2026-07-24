import { cn } from '@/lib/utils';

import { ENABLE_ADS } from '@/config/ads';



interface AdSlotProps {

  slotId: string;

  format?: 'banner' | 'rectangle' | 'sidebar' | 'in-feed';

  adEligible?: boolean;

  className?: string;

  label?: string;

}



const formatHeights: Record<NonNullable<AdSlotProps['format']>, string> = {

  banner: 'min-h-[90px]',

  rectangle: 'min-h-[250px]',

  sidebar: 'min-h-[600px]',

  'in-feed': 'min-h-[120px]',

};



/**

 * AdSense slot placeholder. Renders nothing when ENABLE_ADS=false (pre-approval).

 * Re-enable by setting NEXT_PUBLIC_ENABLE_ADS=true in production env.

 */

export function AdSlot({

  slotId,

  format = 'banner',

  adEligible = true,

  className,

  label = 'Advertisement',

}: AdSlotProps) {

  if (!ENABLE_ADS || !adEligible) return null;



  return (

    <div

      data-ad-slot={slotId}

      data-ad-format={format}

      role="complementary"

      aria-label={label}

      className={cn(

        'ad-slot flex items-center justify-center',

        formatHeights[format],

        className

      )}

    >

      <span className="select-none text-xs text-muted-foreground/60">{label}</span>

    </div>

  );

}


